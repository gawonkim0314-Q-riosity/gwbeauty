import { NextRequest, NextResponse } from "next/server";
import {
  findRelatedByCategory,
  findRelatedByEmbedding,
  getServiceMeta,
} from "@/db/queries";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const serviceId = Number(id);
    const current = await getServiceMeta(serviceId);

    if (!current) {
      return NextResponse.json([]);
    }

    if (!current.embedding?.length) {
      const fallback = await findRelatedByCategory(
        serviceId,
        current.category,
        2
      );
      return NextResponse.json(fallback);
    }

    const related = await findRelatedByEmbedding(
      serviceId,
      current.embedding,
      2
    );
    return NextResponse.json(related);
  } catch (error) {
    console.error("[GET /api/services/[id]/related]", error);
    return NextResponse.json({ error: "Failed to fetch related" }, { status: 500 });
  }
}
