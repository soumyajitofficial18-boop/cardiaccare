import { Suspense } from "react";
import AuthForm from "../../auth-form";

export const metadata = {
  title: "Patient sign in | Cardiac care",
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

export default function PatientLoginPage({ searchParams }) {
  return (
    <Suspense fallback={<AuthForm mode="login" portalRole="user" />}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}
