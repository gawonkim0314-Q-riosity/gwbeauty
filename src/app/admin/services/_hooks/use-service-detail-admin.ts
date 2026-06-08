import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ServiceDetailPage } from "@/db/schema";
import { adminFetch } from "@/lib/auth/admin-fetch";

type DetailPayload = Partial<Omit<ServiceDetailPage, "id" | "createdAt" | "updatedAt">>;

async function upsertDetail(
  serviceId: number,
  data: DetailPayload
): Promise<ServiceDetailPage> {
  const res = await adminFetch(`/api/services/${serviceId}/detail`, {
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

export function useToggleServiceActive(serviceId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isActive: boolean) => {
      const res = await adminFetch(`/api/services/${serviceId}`, {
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
