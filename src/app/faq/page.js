import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CallToAction, PublicPage } from "@/components/public-page";

export const metadata = {
  title: "FAQs | Cardiac care",
  description: "Answers to common questions about getting started with Cardiac care.",
};

const questions = [
  {
    question: "How do I create an account?",
    answer: (
      <>
        Choose{" "}
        <Link className="font-semibold text-emerald-800 underline" href="/signup">
          Get started
        </Link>{" "}
        and register with your name, email, and password. You may need to confirm
        your email before signing in.
      </>
    ),
  },
  {
    question: "Can I choose an online or in-person visit?",
    answer:
      "Cardiac care supports online and in-person appointment options. Available choices depend on the care and appointments offered in the app.",
  },
  {
    question: "Where can I update my personal details?",
    answer: (
      <>
        Sign in and open your profile from your patient dashboard to update your
        name, phone number, or profile photo.
      </>
    ),
  },
  {
    question: "How do I remove my account?",
    answer:
      "You can permanently delete a patient account from your profile settings. You’ll be asked to confirm the action with your password. Account deletion also removes associated appointment and lab-booking history and cannot be undone.",
  },
  {
    question: "Is Cardiac care an emergency service?",
    answer:
      "No. Cardiac care is not an emergency or urgent-care service. If you need immediate medical attention, contact your local emergency services.",
  },
];

export default function FaqPage() {
  return (
    <PublicPage
      description="A few quick answers to help you feel at home. If you’re just getting started, create an account and explore your care options."
      eyebrow="A little help"
      title="Frequently asked questions."
    >
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="divide-y divide-emerald-950/10 rounded-3xl border border-emerald-950/10 bg-white px-6 sm:px-8">
          {questions.map(({ question, answer }) => (
            <details className="group py-6" key={question}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-base font-semibold text-[#183a33] marker:hidden">
                {question}
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 transition group-open:rotate-45">
                  <span aria-hidden="true" className="text-xl leading-none">
                    +
                  </span>
                </span>
              </summary>
              <p className="max-w-2xl pt-4 text-sm leading-7 text-slate-600">
                {answer}
              </p>
            </details>
          ))}
        </div>
        <Link
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"
          href="/signup"
        >
          Get started with Cardiac care
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </section>
      <CallToAction />
    </PublicPage>
  );
}
