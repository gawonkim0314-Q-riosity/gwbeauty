import { db } from "@/db";
import { services, blogPosts, inquiries } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export async function getDashboardStats() {
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

  return {
    services: serviceCount.count,
    blogPosts: blogCount.count,
    inquiries: inquiryCount.count,
    pendingInquiries: pendingCount.count,
  };
}
