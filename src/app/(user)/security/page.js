import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import SessionControls from "@/components/session-controls";
import { CarePage } from "@/components/care-page";

export const metadata = {
  title: "Account security | CareConnect",
};

async function SecurityContent({ searchParams }) {
  await connection();
  const params = await searchParams;
  const signOutError = params?.error === "signout";

  return (
    <CarePage
      description="Manage your active CareConnect sessions and choose whether to sign out from this device or all devices."
      eyebrow="Account settings"
      title="Security & sessions"
    >
      <section className="mt-8 max-w-2xl rounded-3xl border border-emerald-950/10 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-[#183a33]">Active sessions</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Log out on this device to end the current session, or log out everywhere
          to revoke refresh tokens on all your devices. You will need to sign in
          again afterward.
        </p>
        {signOutError && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800" role="alert">
            We could not end the session. Please try again.
          </p>
        )}
        <div className="mt-6">
          <SessionControls />
        </div>
        <Link
          className="mt-7 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-4"
          href="/profile"
        >
          Return to your profile
        </Link>
      </section>
    </CarePage>
  );
}

export default function SecurityPage({ searchParams }) {
  return (
    <Suspense
      fallback={
        <CarePage
          description="Manage your active CareConnect sessions."
          eyebrow="Account settings"
          title="Security & sessions"
        >
          <p className="mt-8 text-sm text-slate-600">Loading session settings...</p>
        </CarePage>
      }
    >
      <SecurityContent searchParams={searchParams} />
    </Suspense>
  );
}
