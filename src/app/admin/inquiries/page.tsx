"use client";

import { useState } from "react";
import { useInquiries, useUpdateInquiry, useDeleteInquiry } from "@/admin/inquiries/_hooks/use-inquiries";
import { AdminTable } from "@/admin/_shared/components/AdminTable";
import type { Inquiry } from "@/db/schema";
import { AdminModal } from "@/admin/_shared/components/AdminModal";
import { useAdminToast } from "@/admin/_shared/components/AdminToast";

const STATUS_OPTIONS = [
  { value: "pending", label: "대기 중", color: "bg-yellow-100 text-yellow-700" },
  { value: "contacted", label: "연락 완료", color: "bg-blue-100 text-blue-700" },
  { value: "completed", label: "상담 완료", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "취소됨", color: "bg-gray-100 text-gray-500" },
];

export default function AdminInquiriesPage() {
  const { data: inquiries = [], isLoading } = useInquiries();
  const updateInquiry = useUpdateInquiry();
  const deleteInquiry = useDeleteInquiry();
  const { showToast } = useAdminToast();

  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateInquiry.mutateAsync({ id, data: { status } });
      const label =
        STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
      showToast(`문의 상태가 "${label}"(으)로 변경되었습니다.`);
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "상태 변경에 실패했습니다.",
        "error"
      );
    }
  };

  const handleDelete = async (inquiry: Inquiry) => {
    if (!confirm(`${inquiry.name}님의 문의를 삭제하시겠습니까?`)) return;
    try {
      await deleteInquiry.mutateAsync(inquiry.id);
      showToast("문의가 삭제되었습니다.");
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "삭제에 실패했습니다.",
        "error"
      );
    }
  };

  const getStatusStyle = (status: string | null) => {
    return (
      STATUS_OPTIONS.find((s) => s.value === status)?.color ??
      "bg-gray-100 text-gray-500"
    );
  };

  const getStatusLabel = (status: string | null) => {
    return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status ?? "-";
  };

  const columns = [
    {
      key: "name",
      header: "이름",
      width: "100px",
      render: (i: Inquiry) => (
        <span className="font-medium text-[#2D1B4E]">{i.name}</span>
      ),
    },
    {
      key: "phone",
      header: "연락처",
      width: "130px",
      render: (i: Inquiry) => (
        <span className="text-sm text-[#5A4070]">{i.phone}</span>
      ),
    },
    {
      key: "service",
      header: "관심 시술",
      render: (i: Inquiry) => (
        <span className="text-sm text-[#5A4070]">{i.service || "-"}</span>
      ),
    },
    {
      key: "preferredDate",
      header: "희망 일자",
      width: "110px",
      render: (i: Inquiry) => (
        <span className="text-xs text-[#A895C0]">
          {i.preferredDate || "-"} {i.preferredTime || ""}
        </span>
      ),
    },
    {
      key: "status",
      header: "상태",
      width: "130px",
      render: (i: Inquiry) => (
        <select
          value={i.status ?? "pending"}
          onChange={(e) => handleStatusChange(i.id, e.target.value)}
          className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer ${getStatusStyle(i.status)}`}
          onClick={(e) => e.stopPropagation()}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "createdAt",
      header: "접수일",
      width: "110px",
      render: (i: Inquiry) => (
        <span className="text-xs text-[#A895C0]">
          {i.createdAt ? new Date(i.createdAt).toLocaleDateString("ko-KR") : "-"}
        </span>
      ),
    },
  ];

  const statusCounts = STATUS_OPTIONS.map((s) => ({
    ...s,
    count: inquiries.filter((i) => i.status === s.value).length,
  }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2D1B4E]">상담 문의 관리</h1>
          <p className="text-sm text-[#5A4070] mt-1">전체 {inquiries.length}건</p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {statusCounts.map((s) => (
          <div
            key={s.value}
            className="rounded-xl px-4 py-3 shadow-sm"
            style={{ background: "white", border: "1px solid #EDE8F5" }}
          >
            <p className="text-xs text-[#A895C0] mb-1">{s.label}</p>
            <p className="text-xl font-bold text-[#2D1B4E]">{s.count}</p>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl shadow-sm p-6"
        style={{ background: "white", border: "1px solid #EDE8F5" }}
      >
        <AdminTable
          columns={columns}
          data={inquiries}
          keyField="id"
          isLoading={isLoading}
          onEdit={(i) => setViewingInquiry(i)}
          onDelete={handleDelete}
        />
      </div>

      {/* Detail Modal */}
      <AdminModal
        isOpen={!!viewingInquiry}
        onClose={() => setViewingInquiry(null)}
        title="문의 상세"
        size="sm"
      >
        {viewingInquiry && (
          <div className="space-y-3">
            {[
              { label: "이름", value: viewingInquiry.name },
              { label: "연락처", value: viewingInquiry.phone },
              { label: "이메일", value: viewingInquiry.email },
              { label: "관심 시술", value: viewingInquiry.service },
              { label: "희망 일자", value: viewingInquiry.preferredDate },
              { label: "희망 시간", value: viewingInquiry.preferredTime },
              { label: "상태", value: getStatusLabel(viewingInquiry.status) },
              {
                label: "접수일",
                value: viewingInquiry.createdAt
                  ? new Date(viewingInquiry.createdAt).toLocaleString("ko-KR")
                  : "-",
              },
            ].map(({ label, value }) =>
              value ? (
                <div key={label} className="flex gap-3">
                  <span className="text-xs font-semibold text-[#A895C0] w-20 shrink-0 pt-0.5">
                    {label}
                  </span>
                  <span className="text-sm text-[#2D1B4E]">{value}</span>
                </div>
              ) : null
            )}
            {viewingInquiry.message && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: "#EDE8F5" }}>
                <p className="text-xs font-semibold text-[#A895C0] mb-1">메시지</p>
                <p className="text-sm text-[#2D1B4E] leading-relaxed whitespace-pre-wrap">
                  {viewingInquiry.message}
                </p>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  );
}
