import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq, ne, sql } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const serviceId = Number(id);

    // Get current service embedding
    const [current] = await db
      .select({ embedding: services.embedding })
      .from(services)
      .where(eq(services.id, serviceId))
      .limit(1);

    if (!current?.embedding) {
      // Fallback: return same-category services
      const [current2] = await db
        .select({ category: services.category })
        .from(services)
        .where(eq(services.id, serviceId))
        .limit(1);

      const fallback = await db
        .select({
          id: services.id,
          title: services.title,
          titleEn: services.titleEn,
          category: services.category,
          imageUrl: services.imageUrl,
          description: services.description,
        })
        .from(services)
        .where(
          sql`${services.category} = ${current2?.category ?? ""} AND ${services.id} != ${serviceId} AND ${services.isActive} = true`
        )
        .limit(2);

      return NextResponse.json(fallback);
    }

    // pgvector cosine similarity: <=>
    const embeddingStr = `[${current.embedding.join(",")}]`;

    const related = await db.execute(
      sql`
        SELECT id, title, title_en, category, image_url, description
        FROM services
        WHERE id != ${serviceId}
          AND is_active = true
          AND embedding IS NOT NULL
        ORDER BY embedding <=> ${embeddingStr}::vector
        LIMIT 2
      `
    );

    return NextResponse.json(
      related.rows.map((r) => ({
        id: r.id,
        title: r.title,
        titleEn: r.title_en,
        category: r.category,
        imageUrl: r.image_url,
        description: r.description,
      }))
    );
  } catch (error) {
    console.error("[GET /api/services/[id]/related]", error);
    return NextResponse.json({ error: "Failed to fetch related" }, { status: 500 });
  }
}
