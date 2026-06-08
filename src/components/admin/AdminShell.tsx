"use client";

import { NextIntlClientProvider } from "next-intl";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { LoginModalProvider } from "@/providers/login-modal-provider";
import koMessages from "../../../messages/ko.json";

/** /admin 은 [locale] 밖 — LoginModal 등 next-intl 컨텍스트를 여기서 제공 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="ko" messages={koMessages}>
      <LoginModalProvider>
        <AdminAuthGuard>
          <div className="flex min-h-screen bg-[#F7F8FA]">
            <AdminSidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </AdminAuthGuard>
      </LoginModalProvider>
    </NextIntlClientProvider>
  );
}
