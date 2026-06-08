import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Inquiry } from "@/db/schema";
import { adminFetch } from "@/lib/auth/admin-fetch";

const INQUIRIES_KEY = ["inquiries"] as const;

async function fetchInquiries(): Promise<Inquiry[]> {
  const res = await adminFetch("/api/inquiries");
  if (!res.ok) throw new Error("Failed to fetch inquiries");
  return res.json();
}

async function updateInquiry(id: number, data: Partial<Inquiry>): Promise<Inquiry> {
  const res = await adminFetch(`/api/inquiries/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update inquiry");
  return res.json();
}

async function deleteInquiry(id: number): Promise<void> {
  const res = await adminFetch(`/api/inquiries/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete inquiry");
}

export function useInquiries() {
  return useQuery({
    queryKey: INQUIRIES_KEY,
    queryFn: fetchInquiries,
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

export function useDeleteInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInquiry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INQUIRIES_KEY }),
  });
}
