import { NextRequest, NextResponse } from "next/server";
import {
  createDetailPage,
  getDetailPage,
  upsertDetailPage,
} from "@/db/queries";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const locale = request.nextUrl.searchParams.get("locale") ?? "ko";
    const detail = await getDetailPage(Number(id), locale);

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
    const created = await createDetailPage(Number(id), body);
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
    const result = await upsertDetailPage(Number(id), locale, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[PUT /api/services/[id]/detail]", error);
    return NextResponse.json({ error: "Failed to update detail" }, { status: 500 });
  }
}
