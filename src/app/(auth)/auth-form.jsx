"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInAction, signUpAction } from "./actions";

const initialState = { error: "", message: "", redirectTo: "" };
const roleLabels = {
  user: "Patient",
  doctor: "Doctor",
  admin: "Admin",
};

export default function AuthForm({
  mode,
  queryError = "",
  portalRole = "user",
}) {
  const isSignup = mode === "signup";
  const action = isSignup ? signUpAction : signInAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.message) toast.success(state.message);
    if (state.redirectTo) {
      toast.success(
        isSignup ? "Your patient account is ready." : "Signed in successfully.",
      );
      router.replace(state.redirectTo);
      router.refresh();
    }
  }, [isSignup, router, state.error, state.message, state.redirectTo]);

  const queryErrorMessage =
    queryError === "profile_missing"
      ? "Your account profile could not be initialized. Please try signing in again."
      : queryError === "profile_lookup"
        ? "We couldn't load your account profile. Please try again."
        : queryError === "confirmation"
          ? "We couldn't confirm your email. Please try signing in again."
          : "";
  const querySuccessMessage =
    queryError === "deleted"
      ? "Your account and related history have been permanently deleted."
      : queryError === "current"
        ? "You have been signed out on this device."
        : queryError === "all"
          ? "You have been signed out on all devices."
      : "";

  useEffect(() => {
    if (queryErrorMessage) toast.error(queryErrorMessage);
    if (querySuccessMessage) toast.success(querySuccessMessage);
  }, [queryErrorMessage, querySuccessMessage]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <Link href="/" className="text-sm font-semibold tracking-wide text-teal-700">
          CARE / CONNECT
        </Link>
        <p className="mt-8 text-sm font-medium text-teal-700">
          {isSignup
            ? `Create your ${roleLabels[portalRole].toLowerCase()} account`
            : `${roleLabels[portalRole]} portal`}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          {isSignup
            ? "Join Cardiac care"
            : `Sign in as ${roleLabels[portalRole].toLowerCase()}`}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {isSignup
            ? "Create an account to manage your healthcare appointments."
            : `Access your ${roleLabels[portalRole].toLowerCase()} account and dashboard.`}
        </p>

        <form action={formAction} className="mt-8 space-y-5">
          {!isSignup && <input name="portalRole" type="hidden" value={portalRole} />}
          {isSignup && (
            <label className="block text-sm font-medium text-slate-700">
              Full name
              <input
                autoComplete="name"
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                name="fullName"
                required
              />
            </label>
          )}
          <label className="block text-sm font-medium text-slate-700">
            Email address
            <input
              autoComplete="email"
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              name="email"
              required
              type="email"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              minLength={isSignup ? 8 : undefined}
              name="password"
              required
              type="password"
            />
          </label>
          <button
            className="flex h-11 w-full items-center justify-center rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending
              ? "Please wait..."
              : isSignup
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-600">
          {isSignup ? "Already have an account?" : "New to Cardiac care?"}{" "}
          <Link
            className="font-semibold text-teal-700 hover:text-teal-800"
            href={
              isSignup
                ? portalRole === "user"
                  ? "/user/login"
                  : `/${portalRole}/login`
                : portalRole === "user"
                  ? "/user/register"
                  : `/${portalRole}/register`
            }
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
        <p className="mt-4 text-center text-xs text-slate-500">
          <Link className="underline underline-offset-2" href="/portals">
            Choose a different portal
          </Link>
        </p>
      </section>
    </main>
  );
}
