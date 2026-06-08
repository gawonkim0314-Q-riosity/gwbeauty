"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { LoginModalProvider } from "@/providers/login-modal-provider";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <LoginModalProvider>
      <AdminAuthGuard>
        <div className="flex min-h-screen bg-[#F7F8FA]">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </AdminAuthGuard>
    </LoginModalProvider>
  );
}
