import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Camera,
  Compass,
  HeartPulse,
  LifeBuoy,
  MapPin,
  Phone,
  ShieldCheck,
  UsersRound,
  Video,
} from "lucide-react";

const linkGroups = [
  {
    title: "Explore",
    icon: Compass,
    links: [
      { href: "/services", label: "Care options" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/doctors", label: "Find a doctor" },
      { href: "/hospitals", label: "Hospitals" },
      { href: "/labs", label: "Lab tests" },
    ],
  },
  {
    title: "Company",
    icon: Building2,
    links: [
      { href: "/about", label: "About us" },
      { href: "/faq", label: "FAQs & help" },
      { href: "/portals", label: "Doctor & admin portals" },
    ],
  },
  {
    title: "Your account",
    icon: ShieldCheck,
    links: [
      { href: "/user/login", label: "Patient sign in" },
      { href: "/user/register", label: "Create an account" },
      { href: "/security", label: "Account security" },
    ],
  },
];

export default function SiteFooter() {
  const socialLinks = [
    { label: "Instagram", icon: Camera },
    { label: "Facebook", icon: UsersRound },
    { label: "LinkedIn", icon: BriefcaseBusiness },
    { label: "YouTube", icon: Video },
  ];

  return (
    <footer className="border-t border-emerald-950/10 bg-[#f3f6f0]">
      <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-8 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_2fr] lg:gap-16">
          <div>
            <Link
              aria-label="Cardiac Care home"
              className="inline-flex items-center gap-3"
              href="/"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-900 text-emerald-50 shadow-sm">
                <HeartPulse aria-hidden="true" size={21} strokeWidth={2.2} />
              </span>
              <span className="text-lg font-semibold tracking-[-0.045em] text-[#12352f]">
                Cardiac<span className="text-emerald-700"> Care</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-600">
              A calmer way to stay connected to your care, from finding the
              right next step to managing your health appointments.
            </p>

            <div className="mt-7 space-y-4">
              <a
                className="inline-flex items-center gap-3 rounded-2xl border border-emerald-950/10 bg-white/70 px-4 py-3 transition hover:border-emerald-900/20 hover:bg-white"
                href="tel:1234567890"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                  <Phone aria-hidden="true" size={17} />
                </span>
                <span>
                  <span className="block text-xs font-medium text-slate-500">
                    Call us
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold text-[#183a33]">
                    1234567890
                  </span>
                </span>
              </a>
              <div>
                <p className="text-xs font-semibold text-slate-600">
                  Follow along
                </p>
                <div aria-label="Social media" className="mt-2 flex gap-2">
                  {socialLinks.map(({ label, icon: Icon }) => (
                    <span
                      aria-label={`${label} profile coming soon`}
                      className="flex size-9 cursor-not-allowed items-center justify-center rounded-xl border border-emerald-950/10 bg-white/70 text-slate-400"
                      key={label}
                      title={`${label} profile coming soon`}
                    >
                      <Icon aria-hidden="true" size={17} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3"
          >
            {linkGroups.map(({ title, icon: Icon, links }) => (
              <div key={title}>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-[#183a33]">
                  <Icon aria-hidden="true" className="text-emerald-800" size={16} />
                  {title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {links.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        className="text-sm text-slate-600 transition hover:text-emerald-900"
                        href={href}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-emerald-950/10 pt-6 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © 2026 Cardiac Care. All rights reserved.
          </p>
          <p className="flex max-w-2xl items-start gap-2 text-xs leading-5 text-slate-500">
            <HeartPulse
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-emerald-800"
              size={14}
            />
            Cardiac Care is not an emergency service and does not replace
            professional medical advice. For urgent medical attention, contact
            your local emergency services.
          </p>
        </div>
      </div>
    </footer>
  );
}
