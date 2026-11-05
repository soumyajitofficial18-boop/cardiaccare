import { Suspense } from "react";
import AuthForm from "../auth-form";

export const metadata = {
  title: "Sign in | Cardiac care",
};

async function LoginContent({ searchParams }) {
  const params = await searchParams;

  return (
    <AuthForm
      mode="login"
      portalRole="user"
      queryError={params?.error ?? params?.account ?? params?.session ?? ""}
    />
  );
}

export default function LoginPage({ searchParams }) {
  return (
    <Suspense fallback={<AuthForm mode="login" portalRole="user" />}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}
