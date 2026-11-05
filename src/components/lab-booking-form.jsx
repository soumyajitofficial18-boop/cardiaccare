"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { bookLabTestAction } from "@/app/(user)/care-actions";

const initialState = { error: "", message: "" };

function getIndiaDateTimeLocal() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(Date.now() + 60 * 60 * 1000));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

export default function LabBookingForm({ labTestId }) {
  const [state, action, pending] = useActionState(
    bookLabTestAction,
    initialState,
  );
  const router = useRouter();

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.message) {
      toast.success(state.message);
      router.refresh();
    }
  }, [router, state.error, state.message]);

  return (
    <form action={action} className="mt-5 space-y-3 border-t border-slate-100 pt-4">
      <input name="labTestId" type="hidden" value={labTestId} />
      <label className="block text-xs font-semibold text-slate-600">
        Preferred date and time
        <input
          className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800"
          min={getIndiaDateTimeLocal()}
          name="scheduledAt"
          required
          type="datetime-local"
        />
      </label>
      <label className="flex items-center gap-2 text-xs text-slate-600">
        <input
          className="size-4 accent-emerald-800"
          name="homeCollection"
          type="checkbox"
          value="true"
        />
        Request home collection
      </label>
      <button
        className="h-9 rounded-full bg-emerald-900 px-4 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Requesting..." : "Request this test"}
      </button>
    </form>
  );
}
