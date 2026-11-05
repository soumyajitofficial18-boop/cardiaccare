"use client";

import { useState } from "react";
import { signOutCurrentAction, signOutEverywhereAction } from "@/app/session-actions";

export default function SessionControls() {
  const [confirmGlobal, setConfirmGlobal] = useState(false);

  return (
    <div className="space-y-5">
      <form action={signOutCurrentAction}>
        <button
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          type="submit"
        >
          Log out this device
        </button>
      </form>
      {!confirmGlobal ? (
        <button
          className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-50"
          onClick={() => setConfirmGlobal(true)}
          type="button"
        >
          Log out all devices
        </button>
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-900">
            This will end your active CareConnect sessions on other devices too.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <form action={signOutEverywhereAction}>
              <button
                className="rounded-full bg-red-800 px-4 py-2 text-sm font-semibold text-white hover:bg-red-900"
                type="submit"
              >
                Confirm log out everywhere
              </button>
            </form>
            <button
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
              onClick={() => setConfirmGlobal(false)}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
