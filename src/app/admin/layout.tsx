import type { Metadata } from "next";
import { AdminShell } from "@/admin/_shared/components/AdminShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | GW Beauty",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
