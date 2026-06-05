import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { serviceDetailPages } from "@/db/schema";
import { and, eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const locale = request.nextUrl.searchParams.get("locale") ?? "ko";
    const serviceId = Number(id);

    const [detail] = await db
      .select()
      .from(serviceDetailPages)
      .where(
        and(
          eq(serviceDetailPages.serviceId, serviceId),
          eq(serviceDetailPages.locale, locale)
        )
      )
      .limit(1);

    if (!detail) {
      return NextResponse.json(null, { status: 404 });
    }
    return NextResponse.json(detail);
  } catch (error) {
    console.error("[GET /api/services/[id]/detail]", error);
    return NextResponse.json({ error: "Failed to fetch detail" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const serviceId = Number(id);

    const [created] = await db
      .insert(serviceDetailPages)
      .values({ ...body, serviceId })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[POST /api/services/[id]/detail]", error);
    return NextResponse.json({ error: "Failed to create detail" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { locale = "ko", ...data } = body;
    const serviceId = Number(id);

    // Upsert: update if exists, insert if not
    const existing = await db
      .select({ id: serviceDetailPages.id })
      .from(serviceDetailPages)
      .where(
        and(
          eq(serviceDetailPages.serviceId, serviceId),
          eq(serviceDetailPages.locale, locale)
        )
      )
      .limit(1);

    let result;
    if (existing.length > 0) {
      [result] = await db
        .update(serviceDetailPages)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(serviceDetailPages.id, existing[0].id))
        .returning();
    } else {
      [result] = await db
        .insert(serviceDetailPages)
        .values({ ...data, serviceId, locale })
        .returning();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[PUT /api/services/[id]/detail]", error);
    return NextResponse.json({ error: "Failed to update detail" }, { status: 500 });
  }
}
