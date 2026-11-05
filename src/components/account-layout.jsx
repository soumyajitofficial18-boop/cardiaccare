import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import AccountNav from "./account-nav";
import { createClient } from "@/lib/supabase/server";

const dashboardPaths = {
  user: "/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/dashboard",
};

async function AccountHeader({ expectedRole }) {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      expectedRole === "user" ? "/user/login" : `/${expectedRole}/login`,
    );
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name,role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return (
      <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-center text-sm text-red-800">
        Your account profile could not be loaded. Apply the auth profile
        migration, then sign in again.
      </div>
    );
  }

  const role = profile?.role;
  if (!role || !dashboardPaths[role]) {
    redirect("/user/login?error=profile_missing");
  }
  if (role !== expectedRole) redirect(dashboardPaths[role]);

  return (
    <AccountNav
      fullName={profile.full_name || user.email || expectedRole}
      role={expectedRole}
    />
  );
}

export default function AccountLayout({ role, children }) {
  return (
    <>
      <Suspense fallback={<AccountNav role={role} />}>
        <AccountHeader expectedRole={role} />
      </Suspense>
      {children}
    </>
  );
}
