"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOutCurrentAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    redirect("/security?error=signout");
  }

  redirect("/user/login?session=current");
}

export async function signOutEverywhereAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "global" });

  if (error) {
    redirect("/security?error=signout");
  }

  redirect("/user/login?session=all");
}
