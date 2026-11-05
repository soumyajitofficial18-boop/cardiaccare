import AccountLayout from "@/components/account-layout";

export default function DoctorLayout({ children }) {
  return <AccountLayout role="doctor">{children}</AccountLayout>;
}
