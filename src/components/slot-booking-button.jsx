"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { bookSlotAction } from "@/app/(user)/care-actions";

const initialState = { error: "", message: "" };

export default function SlotBookingButton({ slot }) {
  const [state, action, pending] = useActionState(bookSlotAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.message) {
      toast.success(state.message);
      router.refresh();
    }
  }, [router, state.error, state.message]);

  return (
    <form action={action}>
      <input name="slotId" type="hidden" value={slot.id} />
      <input name="mode" type="hidden" value={slot.mode} />
      <button
        className="inline-flex h-9 items-center justify-center rounded-full bg-emerald-900 px-4 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Booking..." : "Book this time"}
      </button>
    </form>
  );
}
