"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const slotBookingSchema = z.object({
  slotId: z.string().uuid(),
  mode: z.enum(["online", "offline"]),
});

const labBookingSchema = z.object({
  labTestId: z.string().uuid(),
  scheduledAt: z.string().min(1),
  homeCollection: z.enum(["true", "false"]),
});

export async function bookSlotAction(_previousState, formData) {
  const parsed = slotBookingSchema.safeParse({
    slotId: formData.get("slotId"),
    mode: formData.get("mode"),
  });
  if (!parsed.success) {
    return { error: "Select a valid appointment slot." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Sign in to book an appointment." };

  const { error } = await supabase.rpc("book_slot", {
    p_slot_id: parsed.data.slotId,
    p_mode: parsed.data.mode,
  });

  if (error) {
    return {
      error:
        error.message.includes("already been booked") ||
        error.message.includes("unavailable")
          ? "This time is no longer available. Please choose another slot."
          : error.message,
    };
  }

  revalidatePath("/doctors");
  revalidatePath("/appointments");
  revalidatePath("/dashboard");
  return { message: "Appointment requested. It is now pending confirmation." };
}

export async function bookLabTestAction(_previousState, formData) {
  const parsed = labBookingSchema.safeParse({
    labTestId: formData.get("labTestId"),
    scheduledAt: formData.get("scheduledAt"),
    homeCollection: formData.get("homeCollection") ?? "false",
  });

  if (!parsed.success) {
    return { error: "Choose a lab test and a valid date and time." };
  }

  const scheduledAt = new Date(`${parsed.data.scheduledAt}+05:30`);
  if (Number.isNaN(scheduledAt.getTime())) {
    return { error: "Choose a valid date and time." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Sign in to book a lab test." };

  const { error } = await supabase.rpc("book_lab_test", {
    p_lab_test_id: parsed.data.labTestId,
    p_scheduled_at: scheduledAt.toISOString(),
    p_home_collection: parsed.data.homeCollection === "true",
  });

  if (error) return { error: error.message };

  revalidatePath("/labs");
  revalidatePath("/appointments");
  revalidatePath("/dashboard");
  return { message: "Lab test booking requested successfully." };
}
