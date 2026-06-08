import { NextRequest, NextResponse } from "next/server";
import { createBlogPost, listBlogPosts } from "@/db/queries";
import { requireStaff } from "@/lib/auth/server-auth";
import { slugifyTitle } from "@/lib/blog-blocks";
import { dbErrorMessage, sanitizeBlogPayload } from "@/lib/blog-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    if (all) {
      const { error } = await requireStaff(request);
      if (error) return error;
    }
    const data = await listBlogPosts(!all);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/blog]", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireStaff(request);
  if (error) return error;

  try {
    const body = await request.json();
    const sanitized = sanitizeBlogPayload(body);
    const slug =
      (typeof sanitized.slug === "string" && sanitized.slug.trim()) ||
      slugifyTitle(String(sanitized.title ?? ""));
    const created = await createBlogPost({
      ...sanitized,
      slug,
      updatedAt: new Date(),
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[POST /api/blog]", error);
    return NextResponse.json(
      { error: dbErrorMessage(error) },
      { status: 500 }
    );
  }
}
