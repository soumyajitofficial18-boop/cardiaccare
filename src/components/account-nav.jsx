import Link from "next/link";
import { HeartPulse, LogOut, ShieldCheck } from "lucide-react";
import { signOutCurrentAction } from "@/app/session-actions";

export default function AccountNav({ fullName = "Patient", role = "user" }) {
  const homePath =
    role === "admin"
      ? "/admin/dashboard"
      : role === "doctor"
        ? "/doctor/dashboard"
        : "/dashboard";

  return (
    <header className="border-b border-emerald-950/10 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link className="flex items-center gap-2.5" href={homePath}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-900 text-white">
            <HeartPulse aria-hidden="true" size={18} />
          </span>
          <span className="text-sm font-semibold tracking-tight text-[#15352f]">
            Cardiac care
          </span>
        </Link>
        <nav aria-label="Account navigation" className="flex items-center gap-2 sm:gap-4">
          <span className="hidden max-w-40 truncate text-sm text-slate-500 sm:inline">
            {fullName}
          </span>
          <Link
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-900"
            href="/security"
          >
            <ShieldCheck aria-hidden="true" size={16} />
            <span className="hidden sm:inline">Security</span>
          </Link>
          <form action={signOutCurrentAction}>
            <button
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-800"
              type="submit"
            >
              <LogOut aria-hidden="true" size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </form>
        </nav>
      </div>
      <nav
        aria-label={role === "user" ? "Patient tools" : `${role} tools`}
        className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-5 pb-3 sm:px-8"
      >
        {(role === "user"
          ? [
              ["Overview", "/dashboard"],
              ["Doctors", "/doctors"],
              ["Hospitals", "/hospitals"],
              ["Lab tests", "/labs"],
              ["Appointments", "/appointments"],
              ["My profile", "/profile"],
            ]
          : [
              [`${role[0].toUpperCase()}${role.slice(1)} overview`, homePath],
            ]
        ).map(([label, href]) => (
          <Link
            className="shrink-0 text-xs font-medium capitalize text-slate-600 hover:text-emerald-800"
            href={href}
            key={href}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
