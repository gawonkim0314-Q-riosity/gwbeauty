import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ServiceDetailPage } from "@/db/schema";

type DetailPayload = Partial<Omit<ServiceDetailPage, "id" | "createdAt" | "updatedAt">>;

// ── Fetch detail (public + admin) ─────────────────────────────────────────────
async function fetchDetail(
  serviceId: number,
  locale: string
): Promise<ServiceDetailPage | null> {
  const res = await fetch(
    `/api/services/${serviceId}/detail?locale=${locale}`
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch detail");
  return res.json();
}

export function useServiceDetail(serviceId: number, locale: string) {
  return useQuery({
    queryKey: ["service-detail", serviceId, locale],
    queryFn: () => fetchDetail(serviceId, locale),
    staleTime: 1000 * 60 * 5,
  });
}

// ── Related services ─────────────────────────────────────────────────────────
export function useRelatedServices(serviceId: number) {
  return useQuery({
    queryKey: ["service-related", serviceId],
    queryFn: async () => {
      const res = await fetch(`/api/services/${serviceId}/related`);
      if (!res.ok) throw new Error("Failed to fetch related");
      return res.json();
    },
    staleTime: 1000 * 60 * 10,
  });
}

// ── Upsert detail (admin) ──────────────────────────────────────────────────────
async function upsertDetail(
  serviceId: number,
  data: DetailPayload
): Promise<ServiceDetailPage> {
  const res = await fetch(`/api/services/${serviceId}/detail`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save detail");
  return res.json();
}

export function useUpsertDetail(serviceId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DetailPayload) => upsertDetail(serviceId, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["service-detail", serviceId, result.locale],
      });
    },
  });
}

// ── Toggle isActive (admin) ───────────────────────────────────────────────────
export function useToggleServiceActive(serviceId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isActive: boolean) => {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
