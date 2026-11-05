import Link from "next/link";
import { ArrowRight, HeartPulse } from "lucide-react";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";

export function PublicPage({ eyebrow, title, description, children }) {
  return (
    <div className="min-h-screen bg-[#fbfcf9] text-[#172d29]">
      <SiteHeader />
      <main>
        <section className="border-b border-emerald-950/5 bg-[radial-gradient(ellipse_at_80%_0%,rgba(195,225,199,0.42),transparent_48%)]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
              {eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.055em] text-[#15352f] sm:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {description}
            </p>
          </div>
        </section>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export function CallToAction() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="relative overflow-hidden rounded-[30px] bg-[#123b33] px-7 py-10 text-white sm:px-12 sm:py-14">
        <div className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-5 -top-16 size-52 rounded-full border border-white/10" />
        <div className="relative max-w-2xl">
          <HeartPulse aria-hidden="true" className="text-emerald-200" size={28} />
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Take the next step in your care.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-emerald-50/75">
            Create an account to get started, or sign in to pick up where you
            left off.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-50"
              href="/signup"
            >
              Create an account
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link
              className="inline-flex h-11 items-center rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              href="/login"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
