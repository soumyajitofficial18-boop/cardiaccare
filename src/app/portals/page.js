import Link from "next/link";
import { ArrowRight, BriefcaseMedical, HeartPulse, Shield } from "lucide-react";
import { PublicPage } from "@/components/public-page";

export const metadata = {
  title: "Choose your portal | Cardiac care",
  description:
    "Choose the patient, doctor, or administrator sign-in portal for Cardiac care.",
};

const portals = [
  {
    title: "Patient",
    description:
      "Manage your profile and keep your healthcare details in one place.",
    icon: HeartPulse,
    login: "/user/login",
    register: "/user/register",
    action: "Create a patient account",
  },
  {
    title: "Doctor",
    description:
      "Sign in to your doctor account. New accounts are provisioned by an administrator.",
    icon: BriefcaseMedical,
    login: "/doctor/login",
    register: "/doctor/register",
    action: "Doctor registration",
  },
  {
    title: "Administrator",
    description:
      "Access administration tools with an account provisioned by an authorized operator.",
    icon: Shield,
    login: "/admin/login",
    register: "/admin/register",
    action: "Admin registration",
  },
];

export default function PortalsPage() {
  return (
    <PublicPage
      description="Choose the secure sign-in or registration path for your role. Privileged accounts are provisioned by an administrator."
      eyebrow="Cardiac care access"
      title="Choose your portal."
    >
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-3">
        {portals.map(({ title, description, icon: Icon, login, register, action }) => (
          <article
            className="rounded-3xl border border-emerald-950/10 bg-white p-7"
            key={title}
          >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
              <Icon aria-hidden="true" size={22} />
            </span>
            <h2 className="mt-6 text-xl font-semibold text-[#183a33]">
              {title}
            </h2>
            <p className="mt-3 min-h-14 text-sm leading-6 text-slate-600">
              {description}
            </p>
            <div className="mt-6 flex flex-col items-start gap-3">
              <Link
                className="inline-flex h-10 items-center gap-2 rounded-full bg-emerald-900 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
                href={login}
              >
                {title} sign in
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
              <Link
                className="text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline"
                href={register}
              >
                {action}
              </Link>
            </div>
          </article>
        ))}
      </section>
    </PublicPage>
  );
}
