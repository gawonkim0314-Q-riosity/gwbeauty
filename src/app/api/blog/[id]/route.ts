import { NextRequest, NextResponse } from "next/server";
import {
  deleteBlogPost,
  getBlogPostById,
  updateBlogPost,
} from "@/db/queries";
import { requireStaff } from "@/lib/auth/server-auth";
import { dbErrorMessage, sanitizeBlogPayload } from "@/lib/blog-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await getBlogPostById(Number(id));
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!post.isPublished) {
    const { error } = await requireStaff(request);
    if (error) return error;
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireStaff(request);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const sanitized = sanitizeBlogPayload(body);
    const updated = await updateBlogPost(Number(id), sanitized);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT /api/blog/[id]]", error);
    return NextResponse.json(
      { error: dbErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireStaff(request);
  if (error) return error;

  try {
    const { id } = await params;
    await deleteBlogPost(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/blog/[id]]", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
