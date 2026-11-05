import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[var(--cream-50)] text-[var(--ink-900)] flex flex-col md:flex-row antialiased">
      {/* Admin Sidebar Navigation (Arah A) */}
      <AdminNav adminEmail={session.email} />

      {/* Main Workspace Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
