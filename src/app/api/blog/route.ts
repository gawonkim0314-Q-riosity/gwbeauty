import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    const data = await db
      .select()
      .from(blogPosts)
      .where(all ? undefined : eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.createdAt));

    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/blog]", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
    const [created] = await db
      .insert(blogPosts)
      .values({ ...body, slug })
      .returning();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[POST /api/blog]", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
