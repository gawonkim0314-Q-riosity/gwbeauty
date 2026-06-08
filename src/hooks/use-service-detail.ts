import { useQuery } from "@tanstack/react-query";
import type { ServiceDetailPage } from "@/db/schema";

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

/** 공개·관리자 공용 — 시술 상세 페이지 데이터 */
export function useServiceDetail(serviceId: number, locale: string) {
  return useQuery({
    queryKey: ["service-detail", serviceId, locale],
    queryFn: () => fetchDetail(serviceId, locale),
    staleTime: 1000 * 60 * 5,
  });
}

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
