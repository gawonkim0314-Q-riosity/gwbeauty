"use client";

import { useStats } from "@/hooks/use-stats";
import { MdSpa, MdArticle, MdMail, MdPendingActions } from "react-icons/md";

const STAT_CARDS = [
  {
    key: "services" as const,
    label: "전체 시술",
    icon: MdSpa,
    color: "#8B64C8",
    bg: "#F0EBFF",
  },
  {
    key: "blogPosts" as const,
    label: "블로그 포스트",
    icon: MdArticle,
    color: "#E8748A",
    bg: "#FFF0F4",
  },
  {
    key: "inquiries" as const,
    label: "전체 상담 문의",
    icon: MdMail,
    color: "#A87AD4",
    bg: "#F5EDFF",
  },
  {
    key: "pendingInquiries" as const,
    label: "대기 중 문의",
    icon: MdPendingActions,
    color: "#D4547A",
    bg: "#FFF0F4",
  },
];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useStats();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2D1B4E]">대시보드</h1>
        <p className="text-sm text-[#5A4070] mt-1">GW Beauty 관리자 현황</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, bg }) => (
          <div
            key={key}
            className="rounded-2xl p-5 shadow-sm"
            style={{ background: "white", border: "1px solid #EDE8F5" }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-[#5A4070]">{label}</span>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: bg }}
              >
                <Icon size={20} color={color} />
              </div>
            </div>
            <p
              className="text-3xl font-bold"
              style={{ color }}
            >
              {isLoading ? (
                <span className="inline-block w-12 h-8 rounded animate-pulse bg-gray-100" />
              ) : (
                stats?.[key] ?? 0
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div
        className="rounded-2xl p-6 shadow-sm"
        style={{ background: "white", border: "1px solid #EDE8F5" }}
      >
        <h2 className="text-base font-semibold text-[#2D1B4E] mb-4">빠른 작업</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: "/admin/services", label: "시술 관리", color: "#8B64C8" },
            { href: "/admin/blog", label: "포스트 작성", color: "#E8748A" },
            { href: "/admin/inquiries", label: "문의 확인", color: "#A87AD4" },
            { href: "/admin/users", label: "사용자 관리", color: "#D4547A" },
          ].map(({ href, label, color }) => (
            <a
              key={href}
              href={href}
              className="flex items-center justify-center py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: color }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
