import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import AccountNav from "@/components/account-nav";
import { createClient } from "@/lib/supabase/server";

async function PatientHeader() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/user/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name,role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <AccountNav
      fullName={profile?.full_name || user.email || "Patient"}
      role={profile?.role || "user"}
    />
  );
}

export default function PatientLayout({ children }) {
  return (
    <>
      <Suspense fallback={<AccountNav />}>
        <PatientHeader />
      </Suspense>
      {children}
    </>
  );
}
