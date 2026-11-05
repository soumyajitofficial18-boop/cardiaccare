import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { ArrowRight, CalendarClock, MapPin, Stethoscope } from "lucide-react";
import { z } from "zod";
import { CarePage, DataNotice, formatCurrency } from "@/components/care-page";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Find a doctor | CareConnect",
};

async function DoctorsContent({ searchParams }) {
  await connection();
  const params = await searchParams;
  const supabase = await createClient();
  let doctorsQuery = supabase
    .from("doctor_directory")
    .select(
      "doctor_id,doctor_name,specialization,bio,fee_online,fee_offline,hospital_id,hospital_name,hospital_city",
    );
  const hospitalId = z.string().uuid().safeParse(params?.hospital);
  if (hospitalId.success) {
    doctorsQuery = doctorsQuery.eq("hospital_id", hospitalId.data);
  }
  const { data: doctors, error } = await doctorsQuery.order("doctor_name");

  if (error) {
    return (
      <CarePage
        description="Browse approved healthcare professionals and upcoming appointment availability."
        eyebrow="Care team"
        title="Find a doctor"
      >
        <DataNotice title="Doctor directory is not available">
          Apply the patient care directory migration in Supabase, then refresh
          this page. The directory uses only approved doctors and the existing
          doctors, profiles, and hospitals data.
        </DataNotice>
      </CarePage>
    );
  }

  const { data: slots, error: slotError } = await supabase
    .from("slots")
    .select("id,doctor_id,start_at,mode")
    .eq("is_booked", false)
    .gt("start_at", new Date().toISOString())
    .order("start_at")
    .limit(1000);

  const availability = new Map();
  for (const slot of slots ?? []) {
    const current = availability.get(slot.doctor_id) ?? { count: 0, next: null };
    current.count += 1;
    if (!current.next || slot.start_at < current.next) current.next = slot.start_at;
    availability.set(slot.doctor_id, current);
  }

  return (
    <CarePage
      description="Browse approved healthcare professionals, compare visit modes and fees, and check available appointment times."
      eyebrow="Care team"
      title="Find a doctor"
    >
      {slotError && (
        <DataNotice title="Availability could not be loaded">
          Apply the patient care directory migration in Supabase to enable
          patient access to future appointment slots.
        </DataNotice>
      )}
      {doctors?.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => {
            const available = availability.get(doctor.doctor_id);
            return (
              <article
                className="flex flex-col rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm"
                key={doctor.doctor_id}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                    <Stethoscope aria-hidden="true" size={22} />
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">
                    {available?.count ?? 0} times available
                  </span>
                </div>
                <h2 className="mt-5 text-lg font-semibold text-[#173a33]">
                  {doctor.doctor_name
                    ? `Dr. ${doctor.doctor_name}`
                    : "Healthcare professional"}
                </h2>
                <p className="mt-1 text-sm font-medium text-emerald-800">
                  {doctor.specialization || "General care"}
                </p>
                <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
                  {doctor.bio || "View this provider's profile and appointment availability."}
                </p>
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                  {doctor.hospital_name && (
                    <p className="flex items-center gap-2">
                      <MapPin aria-hidden="true" size={14} />
                      {[doctor.hospital_name, doctor.hospital_city]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <CalendarClock aria-hidden="true" size={14} />
                    {available?.next
                      ? `Next: ${new Intl.DateTimeFormat("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                          timeZone: "Asia/Kolkata",
                        }).format(new Date(available.next))}`
                      : "No upcoming times listed"}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-slate-50 px-3 py-1.5 text-slate-600">
                    Online · {formatCurrency(doctor.fee_online)}
                  </span>
                  <span className="rounded-full bg-slate-50 px-3 py-1.5 text-slate-600">
                    In person · {formatCurrency(doctor.fee_offline)}
                  </span>
                </div>
                <Link
                  className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-emerald-900 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
                  href={`/doctors/${doctor.doctor_id}`}
                >
                  View profile &amp; times
                  <ArrowRight aria-hidden="true" size={15} />
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7">
          <h2 className="font-semibold text-slate-900">
            {doctors?.length === 0
              ? "No approved doctors are listed yet"
              : "Doctor list unavailable"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {doctors?.length === 0
              ? "Please check back later or contact the care team for help finding a provider."
              : "Please try again later."}
          </p>
        </div>
      )}
    </CarePage>
  );
}

export default function DoctorsPage({ searchParams }) {
  return (
    <Suspense
      fallback={
        <CarePage eyebrow="Care team" title="Find a doctor">
          <p className="mt-8 text-sm text-slate-600">Loading doctor directory...</p>
        </CarePage>
      }
    >
      <DoctorsContent searchParams={searchParams} />
    </Suspense>
  );
}
