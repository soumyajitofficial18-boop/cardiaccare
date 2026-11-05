export const metadata = {
  title: "Admin dashboard | Cardiac care",
};

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <p className="text-sm font-semibold text-teal-700">CARE / CONNECT</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Admin dashboard
      </h1>
      <p className="mt-3 text-slate-600">
        Your account is ready. Administration tools will be available here.
      </p>
    </main>
  );
}
