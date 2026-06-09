import { and, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts, services } from "@/db/schema";

export async function listSitemapServices() {
  return db
    .select({
      id: services.id,
      updatedAt: services.updatedAt,
    })
    .from(services)
    .where(eq(services.isActive, true));
}

export async function listSitemapBlogPosts() {
  return db
    .select({
      slug: blogPosts.slug,
      updatedAt: blogPosts.updatedAt,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(
      and(eq(blogPosts.isPublished, true), isNotNull(blogPosts.slug))
    );
}
