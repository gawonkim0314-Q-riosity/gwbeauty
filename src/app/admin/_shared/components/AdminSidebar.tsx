"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdSpa,
  MdArticle,
  MdMail,
  MdPeople,
  MdStorage,
  MdSettings,
  MdOpenInNew,
  MdLogout,
} from "react-icons/md";
import { useAdminSession } from "@/hooks/use-admin-session";
import { useAuth } from "@/providers/auth-provider";
import { signOut } from "@/lib/firebase/auth";
import { ROLE_LABELS } from "@/lib/auth/rbac";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  exact?: boolean;
  adminOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "대시보드", icon: MdDashboard, exact: true },
  { href: "/admin/services", label: "시술 관리", icon: MdSpa },
  { href: "/admin/blog", label: "블로그", icon: MdArticle },
  { href: "/admin/inquiries", label: "상담 문의", icon: MdMail },
  { href: "/admin/users", label: "사용자 관리", icon: MdPeople, adminOnly: true },
  { href: "/admin/system/database", label: "DB 상태", icon: MdStorage, adminOnly: true },
  {
    href: "/admin/system/environment",
    label: "환경 설정",
    icon: MdSettings,
    adminOnly: true,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { session } = useAdminSession();
  const { refreshAuth } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || session?.canManageUsers
  );

  return (
    <aside
      className="w-60 shrink-0 flex flex-col min-h-screen"
      style={{
        background: "linear-gradient(180deg, #2D1B4E 0%, #1a1030 100%)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="px-6 py-6 border-b border-white/10">
        <p className="text-xs tracking-widest text-white/50 uppercase font-semibold mb-1">
          GW Beauty
        </p>
        <p className="text-lg font-bold" style={{ color: "#E8748A" }}>
          Admin Panel
        </p>
        {session && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-white/80 truncate">{session.email}</p>
            <p className="text-[0.65rem] text-white/45 mt-0.5">
              {ROLE_LABELS[session.role]}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {visibleItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/10"}
              `}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, #E8748A22 0%, #8B64C822 100%)",
                      borderLeft: "3px solid #E8748A",
                      color: "white",
                    }
                  : {}
              }
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/ko"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <MdOpenInNew size={14} />
          사이트 보기
        </Link>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            refreshAuth(null);
          }}
          className="flex w-full items-center gap-2 px-4 py-2 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <MdLogout size={14} />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
