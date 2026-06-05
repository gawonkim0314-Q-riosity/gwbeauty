import { NextRequest, NextResponse } from "next/server";
import { createService, listActiveServices } from "@/db/queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const data = await listActiveServices(category);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/services]", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await createService(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[POST /api/services]", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
