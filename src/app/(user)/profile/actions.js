"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(100),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number must be 30 characters or fewer.")
    .regex(/^[+()\d\s.-]*$/, "Enter a valid phone number."),
});

const deleteAccountSchema = z.object({
  confirmation: z.literal("DELETE", {
    error: "Type DELETE to confirm account deletion.",
  }),
  password: z.string().min(1, "Enter your password to confirm."),
});

const maxAvatarSize = 5 * 1024 * 1024;
const allowedAvatarTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function getAuthenticatedUser(supabase) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

export async function updateProfileAction(_previousState, formData) {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);
  if (!user) return { error: "Your session has expired. Please sign in again." };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
    })
    .eq("id", user.id);

  if (error) return { error: "We couldn't update your profile. Please try again." };

  revalidatePath("/profile");
  return { message: "Your profile has been updated." };
}

export async function uploadAvatarAction(_previousState, formData) {
  const avatar = formData.get("avatar");
  if (!(avatar instanceof File) || avatar.size === 0) {
    return { error: "Choose an image to upload." };
  }

  if (!Object.hasOwn(allowedAvatarTypes, avatar.type)) {
    return { error: "Choose a JPG, PNG, or WebP image." };
  }

  if (avatar.size > maxAvatarSize) {
    return { error: "Image must be 5 MB or smaller." };
  }

  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);
  if (!user) return { error: "Your session has expired. Please sign in again." };

  const path = `${user.id}/${randomUUID()}.${allowedAvatarTypes[avatar.type]}`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, avatar, { contentType: avatar.type, upsert: false });

  if (uploadError) {
    return { error: "We couldn't upload your image. Please try again." };
  }

  const { data: previousProfile, error: readError } = await supabase
    .from("profiles")
    .select("avatar_path")
    .eq("id", user.id)
    .single();

  if (readError) {
    const { error: cleanupError } = await supabase.storage
      .from("avatars")
      .remove([path]);
    return {
      error: cleanupError
        ? "The image uploaded, but profile lookup and cleanup failed. Please contact support."
        : "We couldn't load your profile. Please try again.",
    };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_path: path })
    .eq("id", user.id);

  if (updateError) {
    const { error: cleanupError } = await supabase.storage
      .from("avatars")
      .remove([path]);
    return {
      error: cleanupError
        ? "The image uploaded, but saving your profile and cleanup failed. Please contact support."
        : "We couldn't save your profile photo. Please try again.",
    };
  }

  if (previousProfile.avatar_path) {
    const { error: removeError } = await supabase.storage
      .from("avatars")
      .remove([previousProfile.avatar_path]);
    if (removeError) {
      revalidatePath("/profile");
      return {
        message:
          "Your new photo is saved, but the previous image could not be removed.",
      };
    }
  }

  revalidatePath("/profile");
  return { message: "Your profile photo has been updated." };
}

export async function removeAvatarAction() {
  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);
  if (!user) return { error: "Your session has expired. Please sign in again." };

  const { data: profile, error: readError } = await supabase
    .from("profiles")
    .select("avatar_path")
    .eq("id", user.id)
    .single();

  if (readError) return { error: "We couldn't load your profile." };
  if (!profile.avatar_path) return { message: "There is no profile photo to remove." };

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_path: null })
    .eq("id", user.id);

  if (updateError) return { error: "We couldn't remove your profile photo." };

  const { error: removeError } = await supabase.storage
    .from("avatars")
    .remove([profile.avatar_path]);
  if (removeError) {
    return {
      error:
        "Your profile photo was unlinked, but its stored image could not be deleted.",
    };
  }

  revalidatePath("/profile");
  return { message: "Your profile photo has been removed." };
}

export async function deleteAccountAction(_previousState, formData) {
  const parsed = deleteAccountSchema.safeParse({
    confirmation: formData.get("confirmation"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);
  if (!user?.email) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.password,
  });

  if (authError) {
    return { error: "The password is incorrect. Your account was not deleted." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, avatar_path")
    .eq("id", user.id)
    .single();

  if (profileError || profile.role !== "user") {
    return {
      error: "Only patient accounts can be deleted from this page.",
    };
  }

  if (profile.avatar_path) {
    const { error: avatarError } = await supabase.storage
      .from("avatars")
      .remove([profile.avatar_path]);
    if (avatarError) {
      return {
        error: "Your photo could not be removed, so your account was not deleted.",
      };
    }
  }

  const { error: deleteError } = await supabase.rpc("delete_my_account");
  if (deleteError) {
    return {
      error:
        "Your account could not be deleted. Your appointment history was not removed.",
    };
  }

  redirect("/login?account=deleted");
}
