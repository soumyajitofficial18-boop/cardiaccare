import { Suspense } from "react";
import AuthForm from "../../auth-form";

export const metadata = {
  title: "Doctor sign in | Cardiac care",
};

async function LoginContent({ searchParams }) {
  const params = await searchParams;

  return (
    <AuthForm
      mode="login"
      portalRole="doctor"
      queryError={params?.error ?? ""}
    />
  );
}

export default function DoctorLoginPage({ searchParams }) {
  return (
    <Suspense fallback={<AuthForm mode="login" portalRole="doctor" />}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}
