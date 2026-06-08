import { useQuery } from "@tanstack/react-query";
import type { Service } from "@/db/schema";

const SERVICES_KEY = ["services"] as const;

async function fetchServices(category?: string): Promise<Service[]> {
  const url =
    category && category !== "all"
      ? `/api/services?category=${category}`
      : "/api/services";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

/** 공개 사이트용 시술 목록 */
export function useServices(category?: string) {
  return useQuery({
    queryKey: [...SERVICES_KEY, category],
    queryFn: () => fetchServices(category),
  });
}
