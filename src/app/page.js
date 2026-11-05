import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Heart,
  HeartPulse,
  MapPin,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Video,
} from "lucide-react";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import Image from "next/image";
export const metadata = {
  title: "Cardiac care | Healthcare, made a little easier",
  description:
    "A calmer way to explore care options, manage your profile, and stay connected to your healthcare appointments.",
};

const features = [
  {
    icon: CalendarDays,
    title: "Appointments, in one place",
    description:
      "Keep appointment details close at hand and make it easier to stay organized.",
  },
  {
    icon: Video,
    title: "Care on your terms",
    description:
      "Explore online and in-person visit options that fit the kind of care you need.",
  },
  {
    icon: ShieldCheck,
    title: "Your profile, your control",
    description:
      "Update your personal details and profile photo whenever you need to.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fbfcf9] text-[#172d29]">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-40 top-12 size-[590px] rounded-full bg-[radial-gradient(circle,rgba(197,224,198,0.5)_0%,rgba(197,224,198,0)_68%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-24">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-3.5 py-2 text-xs font-semibold text-emerald-900 shadow-sm shadow-emerald-950/5">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                A more thoughtful way to manage care
              </div>
              <h1 className="mt-7 max-w-2xl text-[clamp(3.2rem,7.2vw,5.7rem)] font-semibold leading-[0.99] tracking-[-0.075em] text-[#14372f]">
                Your health,
                <br />
                <span className="font-serif font-medium italic text-emerald-700">
                  a little more
                </span>
                <br />
                in your hands.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                The practical side of healthcare can feel simpler. Explore care
                options, manage your profile, and keep your appointment details
                together with Cardiac care.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-emerald-900 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:-translate-y-0.5 hover:bg-emerald-800"
                  href="/signup"
                >
                  Get started
                  <ArrowUpRight aria-hidden="true" size={17} />
                </Link>
                <Link
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-emerald-950/15 bg-white/80 px-6 text-sm font-semibold text-[#183a33] transition hover:border-emerald-900/30 hover:bg-white"
                  href="/services"
                >
                  Explore care options
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>
              <div className="mt-9 flex items-center gap-3 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#fbfcf9] bg-[#d7e8d7] text-emerald-900">
                    <Heart aria-hidden="true" size={13} />
                  </span>
                  <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#fbfcf9] bg-[#f2dfcc] text-amber-900">
                    <HeartPulse aria-hidden="true" size={13} />
                  </span>
                  <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#fbfcf9] bg-[#dbe5ed] text-sky-900">
                    <Sparkles aria-hidden="true" size={13} />
                  </span>
                </div>
                <span>A calmer start to your care journey</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[550px] lg:ml-auto">
              <div className="absolute -left-7 top-14 size-28 rounded-full bg-[#d9ead7] blur-2xl sm:-left-12" />
              <div className="absolute -right-4 bottom-6 size-36 rounded-full bg-[#f0dfc9] blur-2xl" />
              <div className="relative rounded-[34px] border border-white/90 bg-[#e7f0e5] p-3 shadow-[0_35px_90px_-40px_rgba(27,69,55,0.3)] sm:p-5">
                <div className="relative min-h-[420px] overflow-hidden rounded-[27px] bg-[linear-gradient(145deg,#c9dfcb_0%,#e9eee2_46%,#eedbc5_100%)] p-6 sm:min-h-[500px] sm:p-8">
                  <div className="absolute -right-16 top-9 size-64 rounded-full border border-white/45" />
                  <div className="absolute -right-5 top-20 size-44 rounded-full border border-white/50" />
                  <div className="absolute bottom-0 left-0 right-0 h-48 bg-[linear-gradient(0deg,rgba(251,252,249,0.72),transparent)]" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-[#183a33]">
                      <span className="flex size-8 items-center justify-center rounded-xl bg-white/70">
                        <HeartPulse aria-hidden="true" size={17} />
                      </span>
                      Your care space
                    </div>
                    <span className="flex size-9 items-center justify-center rounded-full bg-white/60 text-emerald-900">
                      <Sparkles aria-hidden="true" size={17} />
                    </span>
                  </div>

                  <div className="absolute left-1/2 top-[47%] flex size-64 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 sm:size-[310px]">
                    <div className="absolute inset-5 rounded-full border border-white/55" />
                    <div className="absolute inset-12 rounded-full border border-white/45" />
                    <div className="relative flex size-40 items-center justify-center rounded-full bg-[linear-gradient(145deg,#f7f7ed,#c8ddc8)] shadow-[0_20px_40px_-20px_rgba(36,74,55,0.32)] sm:size-48">
                      <Image alt="Care space" className="size-full rounded-full object-cover" src="/images/care-space.jpg" height={160} width={160} />

                    </div>
                    <span className="absolute right-1 top-12 flex size-12 items-center justify-center rounded-2xl bg-white text-emerald-800 shadow-md shadow-emerald-950/10">
                      <Stethoscope aria-hidden="true" size={21} />
                    </span>
                    <span className="absolute bottom-7 left-2 flex size-11 items-center justify-center rounded-2xl bg-[#fff4e5] text-amber-800 shadow-md shadow-emerald-950/10">
                      <Heart aria-hidden="true" size={19} />
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl shadow-emerald-950/10 backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-800">
                          A simpler way forward
                        </p>
                        <p className="mt-1.5 text-lg font-semibold tracking-tight text-[#183a33]">
                          Cardiac care 
                        </p>
                      </div>
                      <span className="flex size-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                        <Check aria-hidden="true" size={18} />
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                      <CalendarDays aria-hidden="true" size={15} />
                      Your care details, all together
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -left-4 top-1/3 hidden items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-lg shadow-emerald-950/10 sm:flex">
                <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                  <MapPin aria-hidden="true" size={18} />
                </span>
                <span className="text-xs font-semibold leading-5 text-[#183a33]">
                  Care that works
                  <br />
                  for your day
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-emerald-950/5 bg-[#f3f6f0]">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 md:grid-cols-3 md:gap-0">
            {[
              ["Thoughtful", "A more human care experience"],
              ["Connected", "The details that help you stay on track"],
              ["Yours", "Your profile and your next steps"],
            ].map(([title, detail], index) => (
              <div
                className={`flex items-start gap-3 ${
                  index > 0 ? "md:border-l md:border-emerald-950/10 md:pl-8" : ""
                }`}
                key={title}
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-emerald-800">
                  <Check aria-hidden="true" size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#183a33]">{title}</p>
                  <p className="mt-1 text-sm text-slate-500">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
                Made for real life
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.05em] text-[#15352f] sm:text-4xl">
                Little things that make care feel easier.
              </h2>
            </div>
            <Link
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"
              href="/services"
            >
              See care options
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <article
                className="rounded-3xl border border-emerald-950/10 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/5"
                key={title}
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                  <Icon aria-hidden="true" size={22} />
                </span>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-[#183a33]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24">
          <div className="overflow-hidden rounded-[30px] bg-[#123b33] px-7 py-10 text-white sm:px-12 sm:py-14">
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
                  Start where you are
                </p>
                <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                  Your next step can be a simple one.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50/75 sm:text-base">
                  Set up your account and keep your care details close at hand.
                </p>
              </div>
              <Link
                className="inline-flex h-12 w-fit items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-50"
                href="/signup"
              >
                Create your account
                <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
