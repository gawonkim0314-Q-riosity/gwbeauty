import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const conditions = category && category !== "all"
      ? and(eq(services.isActive, true), eq(services.category, category))
      : eq(services.isActive, true);

    const data = await db
      .select()
      .from(services)
      .where(conditions)
      .orderBy(asc(services.order));

    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/services]", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [created] = await db.insert(services).values(body).returning();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[POST /api/services]", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
