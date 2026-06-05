import { db } from "@/db";
import { services, type NewService } from "@/db/schema";
import { and, asc, eq, isNotNull, ne, sql } from "drizzle-orm";

export const relatedServiceColumns = {
  id: services.id,
  title: services.title,
  titleEn: services.titleEn,
  category: services.category,
  imageUrl: services.imageUrl,
  description: services.description,
};

export async function listActiveServices(category?: string | null) {
  const conditions =
    category && category !== "all"
      ? and(eq(services.isActive, true), eq(services.category, category))
      : eq(services.isActive, true);

  return db
    .select()
    .from(services)
    .where(conditions)
    .orderBy(asc(services.order));
}

export async function getServiceById(id: number) {
  const [row] = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);
  return row ?? null;
}

export async function getActiveServiceById(id: number) {
  const [row] = await db
    .select()
    .from(services)
    .where(and(eq(services.id, id), eq(services.isActive, true)))
    .limit(1);
  return row ?? null;
}

export async function getServiceTitleMeta(id: number) {
  const [row] = await db
    .select({
      title: services.title,
      titleEn: services.titleEn,
      description: services.description,
    })
    .from(services)
    .where(eq(services.id, id))
    .limit(1);
  return row ?? null;
}

export async function createService(data: NewService) {
  const [row] = await db.insert(services).values(data).returning();
  return row;
}

export async function updateService(id: number, data: Partial<NewService>) {
  const [row] = await db
    .update(services)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(services.id, id))
    .returning();
  return row ?? null;
}

export async function deleteService(id: number) {
  await db.delete(services).where(eq(services.id, id));
}

export async function getServiceMeta(id: number) {
  const [row] = await db
    .select({
      embedding: services.embedding,
      category: services.category,
    })
    .from(services)
    .where(eq(services.id, id))
    .limit(1);
  return row ?? null;
}

export async function findRelatedByCategory(
  serviceId: number,
  category: string,
  limit = 2
) {
  return db
    .select(relatedServiceColumns)
    .from(services)
    .where(
      and(
        eq(services.category, category),
        ne(services.id, serviceId),
        eq(services.isActive, true)
      )
    )
    .limit(limit);
}

/** pgvector cosine distance — Drizzle sql + schema column refs */
export async function findRelatedByEmbedding(
  serviceId: number,
  embedding: number[],
  limit = 2
) {
  const vec = sql.raw(`'[${embedding.join(",")}]'::vector`);

  return db
    .select(relatedServiceColumns)
    .from(services)
    .where(
      and(
        ne(services.id, serviceId),
        eq(services.isActive, true),
        isNotNull(services.embedding)
      )
    )
    .orderBy(sql`${services.embedding} <=> ${vec}`)
    .limit(limit);
}
