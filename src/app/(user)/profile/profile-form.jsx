"use client";

import Image from "next/image";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  deleteAccountAction,
  removeAvatarAction,
  updateProfileAction,
  uploadAvatarAction,
} from "./actions";

const initialState = { error: "", message: "" };

function useActionToast(state) {
  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.message) toast.success(state.message);
  }, [state.error, state.message]);
}

export default function ProfileForm({
  profile,
  avatarUrl,
  avatarError,
  avatarManagementAvailable,
}) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateProfileAction,
    initialState,
  );
  const [uploadState, uploadAction, uploadPending] = useActionState(
    uploadAvatarAction,
    initialState,
  );
  const [removeState, removeAction, removePending] = useActionState(
    removeAvatarAction,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteAccountAction,
    initialState,
  );

  useActionToast(profileState);
  useActionToast(uploadState);
  useActionToast(removeState);
  useActionToast(deleteState);

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-slate-950">Profile details</h2>
        <form action={profileAction} className="mt-6 space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Full name
            <input
              autoComplete="name"
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-slate-950 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              defaultValue={profile.full_name ?? ""}
              maxLength={100}
              name="fullName"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Phone number
            <input
              autoComplete="tel"
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-slate-950 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              defaultValue={profile.phone ?? ""}
              maxLength={30}
              name="phone"
              type="tel"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Email address
            <input
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500"
              readOnly
              value={profile.email}
            />
            <span className="mt-1 block text-xs font-normal text-slate-500">
              Email changes are managed through your sign-in provider.
            </span>
          </label>
          <button
            className="h-11 rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
            disabled={profilePending}
            type="submit"
          >
            {profilePending ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>

      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-slate-950">Profile photo</h2>
          {!avatarManagementAvailable && (
            <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900">
              Photo storage is not configured in the database yet. Apply the
              profile management migration to enable profile photos.
            </p>
          )}
          <div className="mt-5 flex items-center gap-4">
            {avatarUrl ? (
              <Image
                alt="Your profile"
                className="size-20 rounded-full border border-slate-200 object-cover"
                height={80}
                src={avatarUrl}
                unoptimized
                width={80}
              />
            ) : (
              <div
                aria-label="No profile photo"
                className="flex size-20 items-center justify-center rounded-full bg-teal-50 text-2xl font-semibold text-teal-800"
              >
                {(profile.full_name?.[0] ?? "?").toUpperCase()}
              </div>
            )}
            <p className="text-sm leading-6 text-slate-600">
              JPG, PNG, or WebP. Maximum file size: 5 MB.
            </p>
          </div>
          {avatarError && (
            <p className="mt-3 text-sm text-red-800" role="alert">
              {avatarError}
            </p>
          )}
          {avatarManagementAvailable && <form action={uploadAction} className="mt-5 space-y-3">
            <input
              accept="image/jpeg,image/png,image/webp"
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-800 hover:file:bg-slate-200"
              name="avatar"
              required
              type="file"
            />
            <button
              className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
              disabled={uploadPending}
              type="submit"
            >
              {uploadPending ? "Uploading..." : "Upload photo"}
            </button>
          </form>}
          {avatarManagementAvailable && avatarUrl && (
            <form action={removeAction} className="mt-3">
              <button
                className="text-sm font-medium text-red-700 hover:text-red-800 disabled:opacity-60"
                disabled={removePending}
                type="submit"
              >
                {removePending ? "Removing..." : "Remove photo"}
              </button>
            </form>
          )}
        </section>

        {profile.role === "user" && (
          <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-red-800">Delete account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This permanently deletes your account, appointment history, and lab
              bookings. This action cannot be undone.
            </p>
            <form action={deleteAction} className="mt-5 space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Type DELETE to confirm
                <input
                  autoComplete="off"
                  className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-slate-950 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                  name="confirmation"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Current password
                <input
                  autoComplete="current-password"
                  className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-slate-950 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                  name="password"
                  required
                  type="password"
                />
              </label>
              <button
                className="h-10 rounded-lg bg-red-700 px-4 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
                disabled={deletePending}
                type="submit"
              >
                {deletePending ? "Deleting account..." : "Permanently delete account"}
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
