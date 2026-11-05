import Link from "next/link";
import {
  ArrowUpRight,
  FlaskConical,
  MapPin,
  Video,
} from "lucide-react";
import { CallToAction, PublicPage } from "@/components/public-page";

export const metadata = {
  title: "Care options | CareConnect",
  description:
    "Explore appointment options available through the CareConnect platform.",
};

const services = [
  {
    icon: Video,
    label: "Consultations",
    title: "Care that fits your day",
    description:
      "Explore appointment options with healthcare professionals and choose a visit mode that works for you.",
    detail: "Online or in person",
  },
  {
    icon: MapPin,
    label: "In-person visits",
    title: "Meet at a hospital",
    description:
      "Find care connected to hospitals and keep the details of your visit together with your appointment.",
    detail: "Hospital-based care",
  },
  {
    icon: FlaskConical,
    label: "Lab tests",
    title: "Keep testing on track",
    description:
      "Lab tests and booking details can be part of a more organized view of your care journey.",
    detail: "Test and booking details",
  },
];

export default function ServicesPage() {
  return (
    <PublicPage
      description="Different care needs call for different next steps. CareConnect is designed to bring appointment and lab-booking details into one simpler experience."
      eyebrow="Care options"
      title="Find a next step that works for you."
    >
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-3">
        {services.map(({ icon: Icon, label, title, description, detail }) => (
          <article
            className="group rounded-3xl border border-emerald-950/10 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/5"
            key={label}
          >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 transition group-hover:bg-emerald-900 group-hover:text-white">
              <Icon aria-hidden="true" size={22} />
            </span>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
              {label}
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-[#183a33]">
              {title}
            </h2>
            <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">
              {description}
            </p>
            <p className="mt-5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
              {detail}
            </p>
          </article>
        ))}
      </section>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"
          href="/how-it-works"
        >
          See how it works
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>
      <CallToAction />
    </PublicPage>
  );
}
