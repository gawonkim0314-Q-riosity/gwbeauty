"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdBuild,
  MdSpa,
  MdArticle,
  MdMail,
  MdOpenInNew,
} from "react-icons/md";

const NAV_ITEMS = [
  { href: "/admin", label: "대시보드", icon: MdDashboard, exact: true },
  { href: "/admin/maintenance", label: "유지관리", icon: MdBuild },
  { href: "/admin/services", label: "SERVICE", icon: MdSpa },
  { href: "/admin/blog", label: "BLOG", icon: MdArticle },
  { href: "/admin/inquiries", label: "INQUIRE", icon: MdMail },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-60 shrink-0 flex flex-col min-h-screen"
      style={{
        background: "linear-gradient(180deg, #2D1B4E 0%, #1a1030 100%)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <p className="text-xs tracking-widest text-white/50 uppercase font-semibold mb-1">
          GW Beauty
        </p>
        <p
          className="text-lg font-bold"
          style={{ color: "#E8748A" }}
        >
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? "text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
                }
              `}
              style={isActive ? { background: "linear-gradient(135deg, #E8748A22 0%, #8B64C822 100%)", borderLeft: "3px solid #E8748A", color: "white" } : {}}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <Link
          href="/ko"
          target="_blank"
          className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <MdOpenInNew size={14} />
          사이트 보기
        </Link>
      </div>
    </aside>
  );
}
