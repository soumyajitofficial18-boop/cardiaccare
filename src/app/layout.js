import { Plus_Jakarta_Sans } from "next/font/google";
import DemoChatWidget from "@/components/demo-chat-widget";
import ToastProvider from "@/components/toast-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Cardiac care | Healthcare, made a little easier",
  description:
    "Explore care options, manage your profile, and stay connected to your healthcare appointments.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <DemoChatWidget />
        <ToastProvider />
      </body>
    </html>
  );
}
