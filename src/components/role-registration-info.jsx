import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const descriptions = {
  doctor: {
    title: "Doctor accounts are provisioned by Cardiac care administrators.",
    detail:
      "To protect patient information, doctor access is enabled only after an administrator creates and verifies your account. Contact your organization’s Cardiac care administrator to get started.",
  },
  admin: {
    title: "Administrator accounts are provisioned securely.",
    detail:
      "Public administrator registration is disabled. An existing authorized system operator must create administrator accounts.",
  },
};

export default function RoleRegistrationInfo({ role }) {
  const content = descriptions[role];

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
          href="/portals"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          All portals
        </Link>
        <span className="mt-8 flex size-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-800">
          <ShieldCheck aria-hidden="true" size={23} />
        </span>
        <p className="mt-6 text-sm font-medium capitalize text-teal-700">
          {role} registration
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          {content.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          {content.detail}
        </p>
        <Link
          className="mt-7 inline-flex h-11 items-center justify-center rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800"
          href={`/${role}/login`}
        >
          Go to {role} sign in
        </Link>
      </section>
    </main>
  );
}
