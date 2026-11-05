import { ArrowRight, CalendarCheck2, ClipboardList, UserRound } from "lucide-react";
import { CallToAction, PublicPage } from "@/components/public-page";

export const metadata = {
  title: "How it works | Cardiac care",
  description:
    "Learn how to get started and manage your healthcare details with Cardiac care.",
};

const steps = [
  {
    number: "01",
    icon: UserRound,
    title: "Create your account",
    description:
      "Sign up with your email and add the basic profile details that help keep your account up to date.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Explore your care options",
    description:
      "Review the available care and visit options, then choose the next step that best suits your needs.",
  },
  {
    number: "03",
    icon: CalendarCheck2,
    title: "Keep your details together",
    description:
      "Use your account to manage your profile and keep track of appointment-related information.",
  },
];

export default function HowItWorksPage() {
  return (
    <PublicPage
      description="Getting started should be simple. Here’s the path from setting up your account to keeping your care details organized."
      eyebrow="How it works"
      title="A few simple steps to get started."
    >
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map(({ number, icon: Icon, title, description }, index) => (
            <article
              className="relative rounded-3xl border border-emerald-950/10 bg-white p-7"
              key={number}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold tracking-widest text-emerald-800">
                  {number}
                </span>
                <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                  <Icon aria-hidden="true" size={21} />
                </span>
              </div>
              <h2 className="mt-8 text-xl font-semibold tracking-tight text-[#183a33]">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {description}
              </p>
              {index < steps.length - 1 && (
                <ArrowRight
                  aria-hidden="true"
                  className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 text-emerald-700 md:block"
                  size={20}
                />
              )}
            </article>
          ))}
        </div>
      </section>
      <CallToAction />
    </PublicPage>
  );
}
