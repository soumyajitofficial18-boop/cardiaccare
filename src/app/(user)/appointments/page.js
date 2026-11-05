import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { CalendarDays, FlaskConical } from "lucide-react";
import { CarePage, DataNotice, formatCareTime } from "@/components/care-page";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "My appointments | CareConnect",
};

async function AppointmentsContent() {
  await connection();
  const supabase = await createClient();
  const [{ data: appointments, error }, { data: labBookings, error: labError }] =
    await Promise.all([
      supabase
        .from("appointments")
        .select("id,status,mode,created_at,slot_id,doctor_id")
        .order("created_at", { ascending: false }),
      supabase
        .from("lab_bookings")
        .select("id,lab_test_id,scheduled_at,home_collection,status")
        .order("scheduled_at", { ascending: false }),
    ]);

  const slotIds = (appointments ?? []).map((appointment) => appointment.slot_id);
  const doctorIds = [
    ...new Set((appointments ?? []).map((appointment) => appointment.doctor_id)),
  ];
  const labTestIds = [
    ...new Set((labBookings ?? []).map((booking) => booking.lab_test_id)),
  ];

  const [slotResult, doctorResult, testResult] = await Promise.all([
    slotIds.length
      ? supabase.from("slots").select("id,start_at,end_at").in("id", slotIds)
      : Promise.resolve({ data: [], error: null }),
    doctorIds.length
      ? supabase
          .from("doctor_directory")
          .select("doctor_id,doctor_name,specialization,hospital_name")
          .in("doctor_id", doctorIds)
      : Promise.resolve({ data: [], error: null }),
    labTestIds.length
      ? supabase
          .from("lab_tests")
          .select("id,name,lab:labs(name)")
          .in("id", labTestIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const slotMap = new Map((slotResult.data ?? []).map((slot) => [slot.id, slot]));
  const doctorMap = new Map(
    (doctorResult.data ?? []).map((doctor) => [doctor.doctor_id, doctor]),
  );
  const testMap = new Map((testResult.data ?? []).map((test) => [test.id, test]));

  return (
    <CarePage
      description="Review appointment requests and lab bookings associated with your account."
      eyebrow="Your care"
      title="Appointments & bookings"
    >
      <section className="mt-8 rounded-3xl border border-emerald-950/10 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
            <CalendarDays aria-hidden="true" size={19} />
          </span>
          <h2 className="text-xl font-semibold text-[#183a33]">
            Doctor appointments
          </h2>
        </div>
        {error ? (
          <DataNotice title="Appointments could not be loaded">
            We could not load your appointment history. Check the Supabase
            appointments table and row-level security policy.
          </DataNotice>
        ) : appointments?.length ? (
          <ul className="mt-5 divide-y divide-slate-100">
            {appointments.map((appointment) => {
              const doctor = doctorMap.get(appointment.doctor_id);
              const slot = slotMap.get(appointment.slot_id);
              return (
                <li
                  className="flex flex-wrap items-center justify-between gap-4 py-4"
                  key={appointment.id}
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {doctor?.doctor_name
                        ? `Dr. ${doctor.doctor_name}`
                        : doctor?.specialization || "Doctor appointment"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {slot?.start_at
                        ? formatCareTime(slot.start_at)
                        : "Appointment time unavailable"}
                      {doctor?.hospital_name ? ` · ${doctor.hospital_name}` : ""}
                      {` · ${appointment.mode} visit`}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold capitalize text-amber-900">
                    {appointment.status}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
            You have no doctor appointments yet.{" "}
            <Link className="font-semibold text-emerald-800 underline" href="/doctors">
              Browse available doctors.
            </Link>
          </p>
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-emerald-950/10 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-800">
            <FlaskConical aria-hidden="true" size={19} />
          </span>
          <h2 className="text-xl font-semibold text-[#183a33]">Lab bookings</h2>
        </div>
        {labError ? (
          <DataNotice title="Lab bookings could not be loaded">
            Check the lab booking migration and row-level security policies in
            Supabase, then refresh.
          </DataNotice>
        ) : labBookings?.length ? (
          <ul className="mt-5 divide-y divide-slate-100">
            {labBookings.map((booking) => {
              const test = testMap.get(booking.lab_test_id);
              const lab = Array.isArray(test?.lab) ? test.lab[0] : test?.lab;
              return (
                <li
                  className="flex flex-wrap items-center justify-between gap-4 py-4"
                  key={booking.id}
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {test?.name || "Lab test"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {booking.scheduled_at
                        ? formatCareTime(booking.scheduled_at)
                        : "Time not listed"}
                      {lab?.name ? ` · ${lab.name}` : ""}
                      {booking.home_collection ? " · Home collection requested" : ""}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold capitalize text-amber-900">
                    {booking.status}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
            You have no lab bookings yet.{" "}
            <Link className="font-semibold text-emerald-800 underline" href="/labs">
              Browse lab tests.
            </Link>
          </p>
        )}
      </section>
    </CarePage>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense
      fallback={
        <CarePage eyebrow="Your care" title="Appointments & bookings">
          <p className="mt-8 text-sm text-slate-600">Loading your bookings...</p>
        </CarePage>
      }
    >
      <AppointmentsContent />
    </Suspense>
  );
}
