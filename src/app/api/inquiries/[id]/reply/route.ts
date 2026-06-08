import { NextRequest, NextResponse } from "next/server";
import { getInquiryById, updateInquiry } from "@/db/queries";
import { requireStaff } from "@/lib/auth/server-auth";
import { sanitizeReplyPayload } from "@/lib/inquiry-api";
import { sendInquiryReplyEmail } from "@/lib/email";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireStaff(request);
  if (error) return error;

  try {
    const { id } = await params;
    const inquiryId = Number(id);
    const inquiry = await getInquiryById(inquiryId);
    if (!inquiry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const { reply, adminNotes, markCompleted, error: validationError } =
      sanitizeReplyPayload(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    await sendInquiryReplyEmail({ inquiry, replyBody: reply });

    const updated = await updateInquiry(inquiryId, {
      adminReply: reply,
      adminNotes: adminNotes ?? inquiry.adminNotes,
      repliedAt: new Date(),
      status: markCompleted ? "completed" : "contacted",
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[POST /api/inquiries/[id]/reply]", err);
    const message =
      err instanceof Error ? err.message : "답변 이메일 발송에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
