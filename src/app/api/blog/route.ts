import { NextRequest, NextResponse } from "next/server";
import { createBlogPost, listBlogPosts } from "@/db/queries";
import { requireStaff } from "@/lib/auth/server-auth";

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
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
    const created = await createBlogPost({ ...body, slug });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[POST /api/blog]", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
