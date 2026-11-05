import Link from "next/link";
import { ArrowUpRight, HeartPulse } from "lucide-react";

const links = [
  { href: "/services", label: "Care options" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQs" },
  { href: "/portals", label: "Portals" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-emerald-950/5 bg-[#fbfcf9]/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8">
        <Link
          aria-label="Cardiac care home"
          className="flex shrink-0 items-center gap-2.5"
          href="/"
        >
          <span className="flex size-10 items-center justify-center rounded-[14px] bg-emerald-900 text-emerald-50">
            <HeartPulse aria-hidden="true" size={21} strokeWidth={2.2} />
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.04em] text-[#12352f]">
            Cardiac<span className="text-emerald-700"> Care </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 lg:flex"
        >
          {links.map((link) => (
            <Link
              className="text-[13px] font-medium text-slate-600 transition hover:text-emerald-800"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <Link
            className="hidden px-3 py-2 text-[13px] font-semibold text-slate-700 transition hover:text-emerald-800 sm:inline-flex"
            href="/login"
          >
            Log in
          </Link>
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-full bg-emerald-900 px-4 text-[13px] font-semibold text-white transition hover:bg-emerald-800 sm:px-5"
            href="/signup"
          >
            Get started
            <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </div>
      <nav
        aria-label="Mobile navigation"
        className="flex gap-5 overflow-x-auto border-t border-emerald-950/5 px-5 py-3 lg:hidden sm:px-8"
      >
        {links.map((link) => (
          <Link
            className="shrink-0 text-xs font-medium text-slate-600"
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
