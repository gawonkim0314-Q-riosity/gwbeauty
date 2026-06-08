import { useQuery } from "@tanstack/react-query";
import { adminFetch } from "@/lib/auth/admin-fetch";

interface Stats {
  services: number;
  blogPosts: number;
  inquiries: number;
  pendingInquiries: number;
}

export function useStats() {
  return useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await adminFetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    staleTime: 30 * 1000,
  });
}
