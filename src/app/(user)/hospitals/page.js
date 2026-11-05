import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { Building2, MapPin, Phone, Stethoscope } from "lucide-react";
import { CarePage, DataNotice } from "@/components/care-page";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Hospitals | CareConnect",
};

async function HospitalsContent() {
  await connection();
  const supabase = await createClient();
  const [{ data: hospitals, error }, { data: doctors }] = await Promise.all([
    supabase
      .from("hospitals")
      .select("id,name,address,city,phone")
      .order("name"),
    supabase.from("doctor_directory").select("doctor_id,hospital_id"),
  ]);

  if (error) {
    return (
      <CarePage
        description="Explore hospitals and the care providers associated with them."
        eyebrow="Care locations"
        title="Hospitals"
      >
        <DataNotice title="Hospital directory is not available">
          We could not load hospital information. Verify the Supabase database
          connection and hospital read policies, then try again.
        </DataNotice>
      </CarePage>
    );
  }

  const doctorCounts = new Map();
  for (const doctor of doctors ?? []) {
    if (!doctor.hospital_id) continue;
    doctorCounts.set(
      doctor.hospital_id,
      (doctorCounts.get(doctor.hospital_id) ?? 0) + 1,
    );
  }

  return (
    <CarePage
      description="Browse hospital locations, contact details, and the number of approved CareConnect providers associated with each location."
      eyebrow="Care locations"
      title="Hospitals"
    >
      {hospitals?.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {hospitals.map((hospital) => (
            <article
              className="rounded-3xl border border-emerald-950/10 bg-white p-6"
              id={`hospital-${hospital.id}`}
              key={hospital.id}
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                <Building2 aria-hidden="true" size={22} />
              </span>
              <h2 className="mt-5 text-lg font-semibold text-[#183a33]">
                {hospital.name}
              </h2>
              <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-slate-600">
                <MapPin aria-hidden="true" className="mt-1 shrink-0" size={15} />
                <span>
                  {[hospital.address, hospital.city].filter(Boolean).join(", ") ||
                    "Location details not provided"}
                </span>
              </p>
              {hospital.phone && (
                <a
                  className="mt-2 flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-800"
                  href={`tel:${hospital.phone}`}
                >
                  <Phone aria-hidden="true" size={14} />
                  {hospital.phone}
                </a>
              )}
              <p className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
                <Stethoscope aria-hidden="true" size={14} />
                {doctorCounts.get(hospital.id) ?? 0} approved providers
              </p>
              <Link
                className="mt-4 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-4"
                href={`/doctors?hospital=${hospital.id}`}
              >
                Browse doctors
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7">
          <h2 className="font-semibold text-slate-900">No hospitals listed yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Hospital locations will appear here when they are added to CareConnect.
          </p>
        </div>
      )}
    </CarePage>
  );
}

export default function HospitalsPage() {
  return (
    <Suspense
      fallback={
        <CarePage eyebrow="Care locations" title="Hospitals">
          <p className="mt-8 text-sm text-slate-600">Loading hospitals...</p>
        </CarePage>
      }
    >
      <HospitalsContent />
    </Suspense>
  );
}
