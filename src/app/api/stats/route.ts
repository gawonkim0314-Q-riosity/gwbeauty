import { NextResponse } from "next/server";
import { db } from "@/db";
import { services, blogPosts, inquiries } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export async function GET() {
  try {
    const [[serviceCount], [blogCount], [inquiryCount], [pendingCount]] =
      await Promise.all([
        db.select({ count: count() }).from(services),
        db.select({ count: count() }).from(blogPosts),
        db.select({ count: count() }).from(inquiries),
        db
          .select({ count: count() })
          .from(inquiries)
          .where(eq(inquiries.status, "pending")),
      ]);

    return NextResponse.json({
      services: serviceCount.count,
      blogPosts: blogCount.count,
      inquiries: inquiryCount.count,
      pendingInquiries: pendingCount.count,
    });
  } catch (error) {
    console.error("[GET /api/stats]", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
