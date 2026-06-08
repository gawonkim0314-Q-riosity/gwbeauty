import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Inquiry } from "@/db/schema";
import { adminFetch } from "@/lib/auth/admin-fetch";

export type InquiryListParams = {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  replied?: "true" | "false" | "all";
};

export type InquiryStats = {
  pending: number;
  contacted: number;
  completed: number;
  cancelled: number;
  unanswered: number;
  total: number;
};

export type InquiryListResponse = {
  items: Inquiry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats?: InquiryStats;
};

const INQUIRIES_KEY = ["inquiries"] as const;

function buildQuery(params: InquiryListParams) {
  const q = new URLSearchParams();
  q.set("stats", "1");
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.status) q.set("status", params.status);
  if (params.search) q.set("search", params.search);
  if (params.replied) q.set("replied", params.replied);
  return q.toString();
}

async function fetchInquiries(params: InquiryListParams): Promise<InquiryListResponse> {
  const res = await adminFetch(`/api/inquiries?${buildQuery(params)}`);
  if (!res.ok) throw new Error("Failed to fetch inquiries");
  return res.json();
}

async function fetchInquiry(id: number): Promise<Inquiry> {
  const res = await adminFetch(`/api/inquiries/${id}`);
  if (!res.ok) throw new Error("Failed to fetch inquiry");
  return res.json();
}

async function updateInquiry(id: number, data: Partial<Inquiry>): Promise<Inquiry> {
  const res = await adminFetch(`/api/inquiries/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to update inquiry");
  }
  return res.json();
}

async function replyInquiry(
  id: number,
  data: { reply: string; adminNotes?: string; markCompleted?: boolean }
): Promise<Inquiry> {
  const res = await adminFetch(`/api/inquiries/${id}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to send reply");
  }
  return res.json();
}

async function deleteInquiry(id: number): Promise<void> {
  const res = await adminFetch(`/api/inquiries/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete inquiry");
}

export function useInquiries(params: InquiryListParams) {
  return useQuery({
    queryKey: [...INQUIRIES_KEY, params],
    queryFn: () => fetchInquiries(params),
  });
}

export function useInquiry(id: number | null) {
  return useQuery({
    queryKey: [...INQUIRIES_KEY, "detail", id],
    queryFn: () => fetchInquiry(id!),
    enabled: id != null,
  });
}

export function useUpdateInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Inquiry> }) =>
      updateInquiry(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INQUIRIES_KEY }),
  });
}

export function useReplyInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: number;
      reply: string;
      adminNotes?: string;
      markCompleted?: boolean;
    }) => replyInquiry(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INQUIRIES_KEY }),
  });
}

export function useDeleteInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInquiry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INQUIRIES_KEY }),
  });
}
