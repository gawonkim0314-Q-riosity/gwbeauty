import { NextRequest, NextResponse } from "next/server";
import { createInquiry, listInquiries } from "@/db/queries";
import { requireStaff } from "@/lib/auth/server-auth";

export async function GET(request: NextRequest) {
  const { error } = await requireStaff(request);
  if (error) return error;

  try {
    const data = await listInquiries();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/inquiries]", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await createInquiry(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[POST /api/inquiries]", error);
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 });
  }
}
