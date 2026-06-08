"use client";

import { use } from "react";
import { ServiceDetailEditor } from "@/admin/services/_components/ServiceDetailEditor";

export default function AdminServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ServiceDetailEditor serviceId={Number(id)} />;
}
