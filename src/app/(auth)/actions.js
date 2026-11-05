"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const roleSchema = z.enum(["user", "doctor", "admin"]);
const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  portalRole: roleSchema,
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

function dashboardPath(role) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "doctor") return "/doctor/dashboard";
  if (role === "user") return "/dashboard";
  return null;
}

export async function signInAction(_previousState, formData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    portalRole: formData.get("portalRole"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Email or password is incorrect. Please try again." };
  }

  const { data: role, error: profileError } = await supabase.rpc(
    "ensure_my_profile",
  );
  if (profileError) {
    await supabase.auth.signOut();
    return {
      error:
        "We couldn't set up your account profile. Please contact the administrator.",
    };
  }

  if (role !== parsed.data.portalRole) {
    await supabase.auth.signOut();
    const portalName =
      role === "doctor" ? "doctor" : role === "admin" ? "admin" : "patient";
    return {
      error: `This account is registered for the ${portalName} portal. Please use that sign-in page.`,
    };
  }

  const destination = dashboardPath(role);
  if (!destination) {
    await supabase.auth.signOut();
    return { error: "This account does not have an active portal." };
  }

  return { redirectTo: destination };
}

export async function signUpAction(_previousState, formData) {
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const origin = (await headers()).get("origin");
  if (!origin) {
    return { error: "Unable to determine the signup URL. Please try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: new URL("/auth/callback", origin).toString(),
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    return {
      message: "Account created. Check your email for a confirmation link.",
    };
  }

  const { data: role, error: profileError } = await supabase.rpc(
    "ensure_my_profile",
  );
  if (profileError || role !== "user") {
    await supabase.auth.signOut();
    return {
      error:
        "Your account was created, but its patient profile could not be initialized. Please contact the administrator.",
    };
  }

  return { redirectTo: dashboardPath("user") };
}
