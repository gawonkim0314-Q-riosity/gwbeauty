import { NextRequest, NextResponse } from "next/server";
import {
  createInquiry,
  listInquiriesPaginated,
  countInquiriesByStatus,
} from "@/db/queries";
import { requireStaff } from "@/lib/auth/server-auth";
import { sanitizeCreateInquiry } from "@/lib/inquiry-api";
import {
  sendInquiryAdminNotification,
  sendInquiryReceivedEmail,
} from "@/lib/email";

export async function GET(request: NextRequest) {
  const { error } = await requireStaff(request);
  if (error) return error;

  try {
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");
    const status = searchParams.get("status") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const replied = (searchParams.get("replied") ?? undefined) as
      | "true"
      | "false"
      | "all"
      | undefined;

    const result = await listInquiriesPaginated({
      page,
      limit,
      status: status === "all" ? undefined : status,
      search,
      replied: replied === "all" ? undefined : replied,
    });

    const includeStats = searchParams.get("stats") === "1";
    const stats = includeStats ? await countInquiriesByStatus() : undefined;

    return NextResponse.json({ ...result, stats });
  } catch (err) {
    console.error("[GET /api/inquiries]", err);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error: validationError } = sanitizeCreateInquiry(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const created = await createInquiry(data);

    try {
      await Promise.all([
        sendInquiryReceivedEmail(created),
        sendInquiryAdminNotification(created),
      ]);
    } catch (emailErr) {
      console.error("[POST /api/inquiries] email notification failed:", emailErr);
    }

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[POST /api/inquiries]", error);
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 });
  }
}
