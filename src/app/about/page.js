import { HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { CallToAction, PublicPage } from "@/components/public-page";

export const metadata = {
  title: "About | Cardiac care",
  description:
    "Learn about Cardiac care and our goal of making healthcare appointments easier to manage.",
};

const values = [
  {
    icon: HeartHandshake,
    title: "Care that feels human",
    description:
      "Healthcare is personal. We aim to make the practical parts feel clearer, warmer, and easier to navigate.",
  },
  {
    icon: ShieldCheck,
    title: "Your information matters",
    description:
      "Your account is designed around your care. We take privacy seriously and protect access to personal information.",
  },
  {
    icon: Sparkles,
    title: "Less friction, more focus",
    description:
      "Simple tools can make it easier to keep track of appointments and focus on what matters: your wellbeing.",
  },
];

export default function AboutPage() {
  return (
    <PublicPage
      description="We believe managing healthcare should feel more personal and less complicated. Cardiac care brings essential appointment tools together in one thoughtful place."
      eyebrow="A more connected care experience"
      title="Healthcare, with a little more humanity."
    >
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <article
              className="rounded-3xl border border-emerald-950/10 bg-white p-7"
              key={title}
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                <Icon aria-hidden="true" size={23} />
              </span>
              <h2 className="mt-6 text-lg font-semibold tracking-tight text-[#183a33]">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>
      <CallToAction />
    </PublicPage>
  );
}
