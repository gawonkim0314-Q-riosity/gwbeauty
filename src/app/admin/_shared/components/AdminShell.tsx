"use client";

import { NextIntlClientProvider } from "next-intl";
import { AdminSidebar } from "@/admin/_shared/components/AdminSidebar";
import { AdminAuthGuard } from "@/admin/_shared/components/AdminAuthGuard";
import { AdminToastProvider } from "@/admin/_shared/components/AdminToast";
import { LoginModalProvider } from "@/providers/login-modal-provider";
import koMessages from "../../../../../messages/ko.json";

/** /admin 은 [locale] 밖 — LoginModal 등 next-intl 컨텍스트를 여기서 제공 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="ko" messages={koMessages}>
      <AdminToastProvider>
        <LoginModalProvider>
          <AdminAuthGuard>
            <div className="flex min-h-screen bg-[#F7F8FA]">
              <AdminSidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </AdminAuthGuard>
        </LoginModalProvider>
      </AdminToastProvider>
    </NextIntlClientProvider>
  );
}
