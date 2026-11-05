import AuthForm from "../../auth-form";

export const metadata = {
  title: "Patient registration | Cardiac care",
};

export default function PatientRegisterPage() {
  return <AuthForm mode="signup" portalRole="user" />;
}
