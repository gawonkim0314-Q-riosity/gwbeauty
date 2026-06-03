import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Service, NewService } from "@/db/schema";

const SERVICES_KEY = ["services"] as const;

async function fetchServices(category?: string): Promise<Service[]> {
  const url = category && category !== "all"
    ? `/api/services?category=${category}`
    : "/api/services";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

async function fetchAllServices(): Promise<Service[]> {
  const res = await fetch("/api/services");
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

async function createService(data: Omit<NewService, "id">): Promise<Service> {
  const res = await fetch("/api/services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create service");
  return res.json();
}

async function updateService(id: number, data: Partial<Service>): Promise<Service> {
  const res = await fetch(`/api/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update service");
  return res.json();
}

async function deleteService(id: number): Promise<void> {
  const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete service");
}

export function useServices(category?: string) {
  return useQuery({
    queryKey: [...SERVICES_KEY, category],
    queryFn: () => fetchServices(category),
  });
}

export function useAllServices() {
  return useQuery({
    queryKey: SERVICES_KEY,
    queryFn: fetchAllServices,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEY });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Service> }) =>
      updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEY });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEY });
    },
  });
}
