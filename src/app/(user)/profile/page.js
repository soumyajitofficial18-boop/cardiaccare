import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import ProfileForm from "./profile-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Your profile | Cardiac care",
};

async function ProfileContent() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, phone, role, avatar_path")
    .eq("id", user.id)
    .maybeSingle();

  let avatarManagementAvailable = true;
  if (error?.code === "42703") {
    const legacyProfile = await supabase
      .from("profiles")
      .select("full_name, phone, role")
      .eq("id", user.id)
      .maybeSingle();
    profile = legacyProfile.data
      ? { ...legacyProfile.data, avatar_path: null }
      : null;
    error = legacyProfile.error;
    avatarManagementAvailable = false;
  }

  if (!error && !profile) {
    const { error: initializeError } = await supabase.rpc("ensure_my_profile");
    if (!initializeError) {
      const refreshedProfile = await supabase
        .from("profiles")
        .select("full_name, phone, role, avatar_path")
        .eq("id", user.id)
        .maybeSingle();
      profile = refreshedProfile.data;
      error = refreshedProfile.error;
      if (error?.code === "42703") {
        const legacyProfile = await supabase
          .from("profiles")
          .select("full_name, phone, role")
          .eq("id", user.id)
          .maybeSingle();
        profile = legacyProfile.data
          ? { ...legacyProfile.data, avatar_path: null }
          : null;
        error = legacyProfile.error;
        avatarManagementAvailable = false;
      }
    } else {
      error = initializeError;
    }
  }

  if (error || !profile) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Profile unavailable
        </h1>
        <p className="mt-3 text-slate-600">
          {error
            ? "We couldn't load your profile from Supabase. Check that the database migrations are applied and try again."
            : "Your profile record is missing. Sign out and sign in again to initialize it."}
        </p>
      </main>
    );
  }

  let avatarUrl = null;
  let avatarError = "";
  if (profile.avatar_path) {
    const { data: signedAvatar, error: signedUrlError } = await supabase.storage
      .from("avatars")
      .createSignedUrl(profile.avatar_path, 60 * 60);
    if (signedUrlError) {
      avatarError = "Your profile photo could not be loaded.";
    } else {
      avatarUrl = signedAvatar.signedUrl;
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16">
      <Link
        className="text-sm font-semibold text-teal-700 hover:text-teal-800"
        href="/dashboard"
      >
        Back to dashboard
      </Link>
      <p className="mt-8 text-sm font-semibold text-teal-700">CARE / CONNECT</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Your profile
      </h1>
      <p className="mt-3 text-slate-600">
        Manage the personal information and photo associated with your account.
      </p>
      <ProfileForm
        avatarManagementAvailable={avatarManagementAvailable}
        avatarError={avatarError}
        avatarUrl={avatarUrl}
        profile={{ ...profile, email: user.email ?? "" }}
      />
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-5xl px-6 py-16">
          <p className="text-slate-600">Loading your profile...</p>
        </main>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
