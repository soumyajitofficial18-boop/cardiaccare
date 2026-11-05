import Link from "next/link";

export function CarePage({ eyebrow, title, description, children }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#15352f] sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          {description}
        </p>
      )}
      {children}
    </main>
  );
}

export function DataNotice({ title, children, actionHref = "/dashboard", actionLabel = "Back to overview" }) {
  return (
    <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <h2 className="font-semibold text-amber-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-amber-900">{children}</p>
      <Link
        className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline underline-offset-4"
        href={actionHref}
      >
        {actionLabel}
      </Link>
    </section>
  );
}

export function formatCareTime(value) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

export function formatCurrency(value) {
  if (value === null || value === undefined) return "Contact for fees";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
