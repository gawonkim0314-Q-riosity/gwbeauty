"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useInquiries,
  useUpdateInquiry,
  useDeleteInquiry,
  useReplyInquiry,
  type InquiryListParams,
} from "@/admin/inquiries/_hooks/use-inquiries";
import { AdminTable } from "@/admin/_shared/components/AdminTable";
import { AdminModal } from "@/admin/_shared/components/AdminModal";
import { useAdminToast } from "@/admin/_shared/components/AdminToast";
import type { Inquiry } from "@/db/schema";
import {
  MdSearch,
  MdEmail,
  MdCheckCircle,
  MdSchedule,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

const STATUS_OPTIONS = [
  { value: "pending", label: "대기 중", color: "bg-yellow-100 text-yellow-700" },
  { value: "contacted", label: "연락 완료", color: "bg-blue-100 text-blue-700" },
  { value: "completed", label: "답변 완료", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "취소됨", color: "bg-gray-100 text-gray-500" },
];

type FilterTab = "all" | "unanswered" | "answered" | string;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "unanswered", label: "미답변" },
  { key: "answered", label: "답변 완료" },
  { key: "pending", label: "대기 중" },
  { key: "contacted", label: "연락 완료" },
  { key: "completed", label: "처리 완료" },
  { key: "cancelled", label: "취소" },
];

const PAGE_SIZE = 10;

export function InquiriesListPage() {
  const { showToast } = useAdminToast();
  const updateInquiry = useUpdateInquiry();
  const deleteInquiry = useDeleteInquiry();
  const replyInquiry = useReplyInquiry();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [markCompleted, setMarkCompleted] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const listParams: InquiryListParams = {
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    ...(activeTab === "unanswered"
      ? { replied: "false" as const }
      : activeTab === "answered"
        ? { replied: "true" as const }
        : activeTab !== "all"
          ? { status: activeTab }
          : {}),
  };

  const { data, isLoading } = useInquiries(listParams);
  const items = data?.items ?? [];
  const stats = data?.stats;
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const openDetail = useCallback((inquiry: Inquiry) => {
    setViewingInquiry(inquiry);
    setReplyText(inquiry.adminReply ?? "");
    setAdminNotes(inquiry.adminNotes ?? "");
    setMarkCompleted(true);
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateInquiry.mutateAsync({ id, data: { status } });
      const label = STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
      showToast(`상태가 "${label}"(으)로 변경되었습니다.`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "상태 변경에 실패했습니다.", "error");
    }
  };

  const handleDelete = async (inquiry: Inquiry) => {
    if (!confirm(`${inquiry.name}님의 문의를 삭제하시겠습니까?`)) return;
    try {
      await deleteInquiry.mutateAsync(inquiry.id);
      showToast("문의가 삭제되었습니다.");
      if (viewingInquiry?.id === inquiry.id) setViewingInquiry(null);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "삭제에 실패했습니다.", "error");
    }
  };

  const handleSaveNotes = async () => {
    if (!viewingInquiry) return;
    try {
      const updated = await updateInquiry.mutateAsync({
        id: viewingInquiry.id,
        data: { adminNotes: adminNotes.trim() || null },
      });
      showToast("내부 메모가 저장되었습니다.");
      setViewingInquiry(updated);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "저장에 실패했습니다.", "error");
    }
  };

  const handleSendReply = async () => {
    if (!viewingInquiry) return;
    if (!replyText.trim()) {
      showToast("답변 내용을 입력해 주세요.", "error");
      return;
    }
    if (!viewingInquiry.email) {
      showToast("문의자 이메일이 없어 발송할 수 없습니다.", "error");
      return;
    }
    try {
      const updated = await replyInquiry.mutateAsync({
        id: viewingInquiry.id,
        reply: replyText.trim(),
        adminNotes: adminNotes.trim() || undefined,
        markCompleted,
      });
      showToast("답변 이메일이 발송되었습니다.");
      setViewingInquiry(updated);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "이메일 발송에 실패했습니다.", "error");
    }
  };

  const getStatusStyle = (status: string | null) =>
    STATUS_OPTIONS.find((s) => s.value === status)?.color ?? "bg-gray-100 text-gray-500";

  const getStatusLabel = (status: string | null) =>
    STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status ?? "-";

  const columns = [
    {
      key: "name",
      header: "이름",
      width: "90px",
      render: (i: Inquiry) => (
        <span className="font-medium text-[#2D1B4E]">{i.name}</span>
      ),
    },
    {
      key: "contact",
      header: "연락처 / 이메일",
      render: (i: Inquiry) => (
        <div className="text-xs">
          <p className="text-[#5A4070]">{i.phone}</p>
          <p className="text-[#A895C0] truncate max-w-[180px]">{i.email || "-"}</p>
        </div>
      ),
    },
    {
      key: "service",
      header: "관심 시술",
      render: (i: Inquiry) => (
        <span className="text-sm text-[#5A4070] truncate max-w-[140px] block">
          {i.service || "-"}
        </span>
      ),
    },
    {
      key: "reply",
      header: "답변",
      width: "90px",
      render: (i: Inquiry) =>
        i.adminReply ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
            <MdCheckCircle size={14} /> 완료
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
            <MdSchedule size={14} /> 미답변
          </span>
        ),
    },
    {
      key: "status",
      header: "상태",
      width: "120px",
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
      width: "100px",
      render: (i: Inquiry) => (
        <span className="text-xs text-[#A895C0]">
          {i.createdAt ? new Date(i.createdAt).toLocaleDateString("ko-KR") : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2D1B4E]">상담 문의 관리</h1>
          <p className="text-sm text-[#5A4070] mt-1">
            전체 {stats?.total ?? total}건 · 미답변 {stats?.unanswered ?? 0}건
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <MdSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A895C0]"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="이름, 연락처, 이메일, 내용 검색"
            className="admin-input pl-9 text-sm"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: "미답변", value: stats?.unanswered ?? 0, accent: "#E8748A" },
          { label: "대기 중", value: stats?.pending ?? 0, accent: "#F59E0B" },
          { label: "연락 완료", value: stats?.contacted ?? 0, accent: "#3B82F6" },
          { label: "답변 완료", value: stats?.completed ?? 0, accent: "#22C55E" },
          { label: "취소", value: stats?.cancelled ?? 0, accent: "#9CA3AF" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl px-4 py-3 shadow-sm"
            style={{ background: "white", border: "1px solid #EDE8F5" }}
          >
            <p className="text-xs text-[#A895C0] mb-1">{s.label}</p>
            <p className="text-xl font-bold" style={{ color: s.accent }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setActiveTab(tab.key);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={{
              background: activeTab === tab.key ? "#8B64C8" : "white",
              color: activeTab === tab.key ? "white" : "#5A4070",
              border: activeTab === tab.key ? "none" : "1px solid #EDE8F5",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="rounded-2xl shadow-sm p-6"
        style={{ background: "white", border: "1px solid #EDE8F5" }}
      >
        <AdminTable
          columns={columns}
          data={items}
          keyField="id"
          isLoading={isLoading}
          onEdit={openDetail}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#EDE8F5]">
            <p className="text-xs text-[#A895C0]">
              {total}건 중 {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, total)}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 rounded-lg hover:bg-[#F0EBF8] disabled:opacity-30 text-[#5A4070]"
              >
                <MdChevronLeft size={20} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) pageNum = i + 1;
                else if (page <= 4) pageNum = i + 1;
                else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
                else pageNum = page - 3 + i;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className="w-8 h-8 rounded-lg text-xs font-semibold"
                    style={{
                      background: page === pageNum ? "#8B64C8" : "transparent",
                      color: page === pageNum ? "white" : "#5A4070",
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-lg hover:bg-[#F0EBF8] disabled:opacity-30 text-[#5A4070]"
              >
                <MdChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail + Reply Modal */}
      <AdminModal
        isOpen={!!viewingInquiry}
        onClose={() => setViewingInquiry(null)}
        title={`문의 #${viewingInquiry?.id ?? ""} — ${viewingInquiry?.name ?? ""}`}
        size="lg"
        footer={
          viewingInquiry && (
            <>
              <button
                type="button"
                onClick={() => setViewingInquiry(null)}
                className="px-4 py-2 rounded-xl text-sm text-[#5A4070] border border-[#EDE8F5] hover:bg-gray-50"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={updateInquiry.isPending}
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#8B64C8] border border-[#EDE8F5] hover:bg-[#F0EBF8] disabled:opacity-50"
              >
                메모 저장
              </button>
              <button
                type="button"
                onClick={handleSendReply}
                disabled={replyInquiry.isPending || !viewingInquiry.email}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #E8748A 0%, #8B64C8 100%)",
                }}
              >
                <MdEmail size={16} />
                {replyInquiry.isPending ? "발송 중..." : "이메일 답변 발송"}
              </button>
            </>
          )
        }
      >
        {viewingInquiry && (
          <div className="space-y-5">
            {/* Customer info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["이름", viewingInquiry.name],
                ["연락처", viewingInquiry.phone],
                ["이메일", viewingInquiry.email],
                ["관심 시술", viewingInquiry.service],
                [
                  "희망 일시",
                  [viewingInquiry.preferredDate, viewingInquiry.preferredTime]
                    .filter(Boolean)
                    .join(" ") || "-",
                ],
                ["상태", getStatusLabel(viewingInquiry.status)],
                [
                  "접수일",
                  viewingInquiry.createdAt
                    ? new Date(viewingInquiry.createdAt).toLocaleString("ko-KR")
                    : "-",
                ],
                [
                  "답변 여부",
                  viewingInquiry.adminReply ? "답변 완료" : "미답변",
                ],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <p className="text-[10px] font-semibold text-[#A895C0] uppercase mb-0.5">
                    {label}
                  </p>
                  <p className="text-[#2D1B4E]">{value || "-"}</p>
                </div>
              ))}
            </div>

            {/* Original message */}
            <div
              className="rounded-xl p-4"
              style={{ background: "#F9F7FD", border: "1px solid #EDE8F5" }}
            >
              <p className="text-xs font-semibold text-[#A895C0] mb-2">문의 내용</p>
              <p className="text-sm text-[#2D1B4E] leading-relaxed whitespace-pre-wrap">
                {viewingInquiry.message || "(내용 없음)"}
              </p>
            </div>

            {/* Previous reply */}
            {viewingInquiry.adminReply && viewingInquiry.repliedAt && (
              <div
                className="rounded-xl p-4"
                style={{ background: "#F0EBF8", borderLeft: "4px solid #8B64C8" }}
              >
                <p className="text-xs font-semibold text-[#8B64C8] mb-1">
                  발송된 답변 ·{" "}
                  {new Date(viewingInquiry.repliedAt).toLocaleString("ko-KR")}
                </p>
                <p className="text-sm text-[#2D1B4E] leading-relaxed whitespace-pre-wrap">
                  {viewingInquiry.adminReply}
                </p>
              </div>
            )}

            {viewingInquiry.adminNotes && (
              <div className="rounded-xl p-3 text-xs text-[#5A4070] bg-[#FFFBF0] border border-[#EDE8F5]">
                <span className="font-semibold text-[#A895C0]">내부 메모 · </span>
                {viewingInquiry.adminNotes}
              </div>
            )}

            {/* Reply form */}
            <div>
              <label className="block text-xs font-semibold text-[#2D1B4E] mb-2">
                {viewingInquiry.adminReply ? "답변 수정 후 재발송" : "이메일 답변 작성"}
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={6}
                placeholder="고객에게 보낼 답변을 작성하세요. 발송 시 문의 내용과 함께 이메일로 전달됩니다."
                className="admin-input text-sm resize-y min-h-[140px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A895C0] mb-2">
                내부 메모 (고객에게 전송되지 않음)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={2}
                placeholder="상담 메모, 후속 일정 등"
                className="admin-input text-sm resize-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={markCompleted}
                onChange={(e) => setMarkCompleted(e.target.checked)}
                className="accent-[#8B64C8]"
              />
              <span className="text-sm text-[#5A4070]">
                발송 후 「답변 완료」 상태로 변경
              </span>
            </label>

            {!viewingInquiry.email && (
              <p className="text-xs text-red-500">
                이메일 주소가 없어 답변을 발송할 수 없습니다.
              </p>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  );
}
