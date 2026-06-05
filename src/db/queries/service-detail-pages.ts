import { db } from "@/db";
import {
  serviceDetailPages,
  type NewServiceDetailPage,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getDetailPage(serviceId: number, locale: string) {
  const [row] = await db
    .select()
    .from(serviceDetailPages)
    .where(
      and(
        eq(serviceDetailPages.serviceId, serviceId),
        eq(serviceDetailPages.locale, locale)
      )
    )
    .limit(1);
  return row ?? null;
}

export async function getPublishedDetailPage(
  serviceId: number,
  locale: string
) {
  const row = await getDetailPage(serviceId, locale);
  if (row?.status === "published") return row;

  if (locale !== "ko") {
    return getDetailPage(serviceId, "ko").then((ko) =>
      ko?.status === "published" ? ko : null
    );
  }
  return null;
}

export async function createDetailPage(
  serviceId: number,
  data: Omit<NewServiceDetailPage, "serviceId">
) {
  const [row] = await db
    .insert(serviceDetailPages)
    .values({ ...data, serviceId })
    .returning();
  return row;
}

export async function upsertDetailPage(
  serviceId: number,
  locale: string,
  data: Omit<NewServiceDetailPage, "serviceId" | "locale">
) {
  const [row] = await db
    .insert(serviceDetailPages)
    .values({ ...data, serviceId, locale })
    .onConflictDoUpdate({
      target: [serviceDetailPages.serviceId, serviceDetailPages.locale],
      set: { ...data, updatedAt: new Date() },
    })
    .returning();
  return row;
}
