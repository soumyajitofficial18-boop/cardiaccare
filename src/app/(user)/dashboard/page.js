import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  FlaskConical,
  Stethoscope,
} from "lucide-react";
import { CarePage, DataNotice, formatCareTime } from "@/components/care-page";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Patient dashboard | CareConnect",
};

const quickLinks = [
  {
    href: "/doctors",
    title: "Find a doctor",
    detail: "Browse providers and appointment times",
    icon: Stethoscope,
  },
  {
    href: "/hospitals",
    title: "Explore hospitals",
    detail: "View locations and contact details",
    icon: ClipboardList,
  },
  {
    href: "/labs",
    title: "Browse lab tests",
    detail: "Explore tests and request a booking",
    icon: FlaskConical,
  },
];

async function PatientDashboardContent() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("id,status,mode,created_at,slot_id,doctor_id")
    .order("created_at", { ascending: false })
    .limit(5);

  let recentAppointments = [];
  if (!error && appointments?.length) {
    const slotIds = appointments.map((appointment) => appointment.slot_id);
    const doctorIds = [...new Set(appointments.map((appointment) => appointment.doctor_id))];
    const [{ data: slots }, { data: doctors }] = await Promise.all([
      supabase
        .from("slots")
        .select("id,start_at,end_at")
        .in("id", slotIds),
      supabase
        .from("doctor_directory")
        .select("doctor_id,doctor_name,specialization")
        .in("doctor_id", doctorIds),
    ]);
    const slotMap = new Map((slots ?? []).map((slot) => [slot.id, slot]));
    const doctorMap = new Map(
      (doctors ?? []).map((doctor) => [doctor.doctor_id, doctor]),
    );
    recentAppointments = appointments.map((appointment) => ({
      ...appointment,
      slot: slotMap.get(appointment.slot_id),
      doctor: doctorMap.get(appointment.doctor_id),
    }));
  }

  return (
    <CarePage
      description={`Welcome back${user?.email ? `, ${user.email}` : ""}. Find care, manage appointments, and keep your health details organized.`}
      eyebrow="Patient overview"
      title="Your care, at a glance"
    >
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {quickLinks.map(({ href, title, detail, icon: Icon }) => (
          <Link
            className="group rounded-2xl border border-emerald-950/10 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-950/5"
            href={href}
            key={href}
          >
            <div className="flex items-start justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                <Icon aria-hidden="true" size={19} />
              </span>
              <ArrowRight
                aria-hidden="true"
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-800"
                size={17}
              />
            </div>
            <h2 className="mt-4 font-semibold text-[#183a33]">{title}</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-3xl border border-emerald-950/10 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
              Your schedule
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#183a33]">
              Recent appointments
            </h2>
          </div>
          <Link
            className="text-sm font-semibold text-emerald-800 hover:text-emerald-950"
            href="/appointments"
          >
            View all appointments
          </Link>
        </div>
        {error ? (
          <DataNotice title="Appointments could not be loaded">
            Check the Supabase appointments table and patient read policy, then
            refresh this page.
          </DataNotice>
        ) : recentAppointments.length ? (
          <ul className="mt-5 divide-y divide-slate-100">
            {recentAppointments.map((appointment) => (
              <li
                className="flex flex-wrap items-center justify-between gap-3 py-4"
                key={appointment.id}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 items-center justify-center rounded-xl bg-slate-50 text-emerald-800">
                    <CalendarDays aria-hidden="true" size={17} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {appointment.doctor?.doctor_name
                        ? `Dr. ${appointment.doctor.doctor_name}`
                        : appointment.doctor?.specialization || "Doctor appointment"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {appointment.slot?.start_at
                        ? formatCareTime(appointment.slot.start_at)
                        : "Appointment time unavailable"}
                      {" · "}
                      {appointment.mode} visit
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-900">
                  {appointment.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-800">
              No appointments yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Find a provider and choose from available upcoming times.
            </p>
            <Link
              className="mt-4 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-4"
              href="/doctors"
            >
              Browse doctors
            </Link>
          </div>
        )}
      </section>
    </CarePage>
  );
}

export default function PatientDashboardPage() {
  return (
    <Suspense
      fallback={
        <CarePage
          description="Manage appointments and keep your healthcare details organized."
          eyebrow="Patient overview"
          title="Your care, at a glance"
        >
          <p className="mt-8 text-sm text-slate-600">Loading your care overview...</p>
        </CarePage>
      }
    >
      <PatientDashboardContent />
    </Suspense>
  );
}
