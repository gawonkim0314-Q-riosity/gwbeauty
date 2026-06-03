import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt));
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/inquiries]", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [created] = await db.insert(inquiries).values(body).returning();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[POST /api/inquiries]", error);
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 });
  }
}
