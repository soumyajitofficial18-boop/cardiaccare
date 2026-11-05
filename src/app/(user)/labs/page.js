import { Suspense } from "react";
import { connection } from "next/server";
import { FlaskConical, MapPin } from "lucide-react";
import LabBookingForm from "@/components/lab-booking-form";
import { CarePage, DataNotice, formatCurrency } from "@/components/care-page";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Lab tests | CareConnect",
};

async function LabsContent() {
  await connection();
  const supabase = await createClient();
  const { data: tests, error } = await supabase
    .from("lab_tests")
    .select("id,name,price,lab_id,lab:labs(id,name,address,city)")
    .order("name")
    .limit(200);

  if (error) {
    return (
      <CarePage
        description="Browse lab tests and request a preferred appointment time."
        eyebrow="Diagnostics"
        title="Lab tests"
      >
        <DataNotice title="Lab services are not available">
          We could not load lab tests. Verify the Supabase connection and lab
          catalog read policies, then try again.
        </DataNotice>
      </CarePage>
    );
  }

  return (
    <CarePage
      description="Browse available tests, see the associated lab and listed price, then request a preferred appointment time. Final confirmation is handled by the lab."
      eyebrow="Diagnostics"
      title="Lab tests"
    >
      {tests?.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tests.map((test) => {
            const lab = Array.isArray(test.lab) ? test.lab[0] : test.lab;
            return (
              <article
                className="rounded-3xl border border-emerald-950/10 bg-white p-6"
                key={test.id}
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                  <FlaskConical aria-hidden="true" size={22} />
                </span>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
                  Lab test
                </p>
                <h2 className="mt-2 text-lg font-semibold text-[#183a33]">
                  {test.name || "Diagnostic test"}
                </h2>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {formatCurrency(test.price)}
                </p>
                {lab && (
                  <p className="mt-4 flex items-start gap-2 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
                    <MapPin aria-hidden="true" className="mt-0.5 shrink-0" size={14} />
                    <span>
                      {lab.name}
                      {[lab.address, lab.city].filter(Boolean).length
                        ? ` · ${[lab.address, lab.city].filter(Boolean).join(", ")}`
                        : ""}
                    </span>
                  </p>
                )}
                <LabBookingForm labTestId={test.id} />
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7">
          <h2 className="font-semibold text-slate-900">No lab tests listed yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Available lab services will appear here when they are added.
          </p>
        </div>
      )}
    </CarePage>
  );
}

export default function LabsPage() {
  return (
    <Suspense
      fallback={
        <CarePage eyebrow="Diagnostics" title="Lab tests">
          <p className="mt-8 text-sm text-slate-600">Loading lab tests...</p>
        </CarePage>
      }
    >
      <LabsContent />
    </Suspense>
  );
}
