import AuthForm from "../auth-form";

export const metadata = {
  title: "Create account | Cardiac care",
};

export default function SignupPage() {
  return <AuthForm mode="signup" portalRole="user" />;
}
