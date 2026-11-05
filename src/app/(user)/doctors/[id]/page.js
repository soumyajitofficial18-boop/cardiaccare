import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ArrowLeft, Clock3, MapPin, Stethoscope } from "lucide-react";
import SlotBookingButton from "@/components/slot-booking-button";
import {
  CarePage,
  DataNotice,
  formatCareTime,
  formatCurrency,
} from "@/components/care-page";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Doctor details | CareConnect",
};

const idSchema = z.string().uuid();

async function DoctorDetailContent({ params }) {
  await connection();
  const { id } = await params;
  if (!idSchema.safeParse(id).success) notFound();

  const supabase = await createClient();
  const { data: doctor, error } = await supabase
    .from("doctor_directory")
    .select(
      "doctor_id,doctor_name,specialization,bio,fee_online,fee_offline,hospital_id,hospital_name,hospital_address,hospital_city,hospital_phone",
    )
    .eq("doctor_id", id)
    .maybeSingle();

  if (error) {
    return (
      <CarePage eyebrow="Doctor details" title="Doctor information unavailable">
        <DataNotice title="Could not load this doctor">
          The doctor directory may not be configured yet. Apply the patient care
          directory migration and try again.
        </DataNotice>
      </CarePage>
    );
  }

  if (!doctor) notFound();

  const { data: slots, error: slotsError } = await supabase
    .from("slots")
    .select("id,start_at,end_at,mode")
    .eq("doctor_id", id)
    .eq("is_booked", false)
    .gt("start_at", new Date().toISOString())
    .order("start_at")
    .limit(100);

  return (
    <CarePage
      description="Review provider and hospital information, visit modes, fees, and upcoming appointment times."
      eyebrow="Doctor profile"
      title={doctor.doctor_name ? `Dr. ${doctor.doctor_name}` : "Healthcare professional"}
    >
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 sm:p-8">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
            <Stethoscope aria-hidden="true" size={22} />
          </span>
          <p className="mt-5 text-sm font-semibold text-emerald-800">
            {doctor.specialization || "General care"}
          </p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
            {doctor.bio || "No additional biography has been provided."}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Online consultation
              </p>
              <p className="mt-1 text-lg font-semibold text-[#183a33]">
                {formatCurrency(doctor.fee_online)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                In-person consultation
              </p>
              <p className="mt-1 text-lg font-semibold text-[#183a33]">
                {formatCurrency(doctor.fee_offline)}
              </p>
            </div>
          </div>
          {doctor.hospital_name && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <h2 className="font-semibold text-[#183a33]">Hospital</h2>
              <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-slate-600">
                <MapPin aria-hidden="true" className="mt-1 shrink-0" size={16} />
                <span>
                  {doctor.hospital_name}
                  {doctor.hospital_address ? ` · ${doctor.hospital_address}` : ""}
                  {doctor.hospital_city ? ` · ${doctor.hospital_city}` : ""}
                  {doctor.hospital_phone ? ` · ${doctor.hospital_phone}` : ""}
                </span>
              </p>
              {doctor.hospital_id && (
                <Link
                  className="mt-3 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-4"
                  href={`/hospitals#hospital-${doctor.hospital_id}`}
                >
                  Hospital details
                </Link>
              )}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
                Availability
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[#183a33]">
                Upcoming times
              </h2>
            </div>
            <Clock3 aria-hidden="true" className="text-emerald-800" size={21} />
          </div>
          {slotsError ? (
            <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              Appointment availability is not configured. Apply the patient care
              directory migration in Supabase.
            </p>
          ) : slots?.length ? (
            <ul className="mt-5 space-y-3">
              {slots.map((slot) => (
                <li
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 p-4"
                  key={slot.id}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {formatCareTime(slot.start_at)}
                    </p>
                    <p className="mt-1 text-xs capitalize text-slate-500">
                      {slot.mode} visit
                      {slot.end_at ? ` · until ${formatCareTime(slot.end_at)}` : ""}
                    </p>
                  </div>
                  <SlotBookingButton slot={slot} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              No upcoming times are available. Please check back later.
            </p>
          )}
          <Link
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"
            href="/doctors"
          >
            <ArrowLeft aria-hidden="true" size={15} />
            Back to doctors
          </Link>
        </section>
      </div>
    </CarePage>
  );
}

export default function DoctorDetailPage({ params }) {
  return (
    <Suspense
      fallback={
        <CarePage eyebrow="Doctor profile" title="Loading doctor details...">
          <p className="mt-4 text-sm text-slate-600">
            Loading profile and availability.
          </p>
        </CarePage>
      }
    >
      <DoctorDetailContent params={params} />
    </Suspense>
  );
}
