import { Suspense } from "react";
import AuthForm from "../../auth-form";

export const metadata = {
  title: "Admin sign in | Cardiac care",
};

async function LoginContent({ searchParams }) {
  const params = await searchParams;

  return (
    <AuthForm
      mode="login"
      portalRole="admin"
      queryError={params?.error ?? ""}
    />
  );
}

export default function AdminLoginPage({ searchParams }) {
  return (
    <Suspense fallback={<AuthForm mode="login" portalRole="admin" />}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}
