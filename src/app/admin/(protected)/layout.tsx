import { redirect } from "next/navigation";
import { AdminShell } from "@/app/admin/admin-shell";
import { requireAdmin } from "@/lib/supabase/server";

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) redirect("/admin/login");
  return <AdminShell email={user.email ?? "Administrator"}>{children}</AdminShell>;
}
