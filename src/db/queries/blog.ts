import { db } from "@/db";
import { blogPosts, type NewBlogPost } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function listBlogPosts(publishedOnly: boolean, limit?: number) {
  const base = db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt));

  if (publishedOnly) {
    const q = base.where(eq(blogPosts.isPublished, true));
    return limit ? q.limit(limit) : q;
  }
  return limit ? base.limit(limit) : base;
}

export async function getBlogPostById(id: number) {
  const [row] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);
  return row ?? null;
}

export async function getBlogPostBySlug(slug: string, publishedOnly = false) {
  const conditions = publishedOnly
    ? and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true))
    : eq(blogPosts.slug, slug);

  const [row] = await db
    .select()
    .from(blogPosts)
    .where(conditions)
    .limit(1);
  return row ?? null;
}

export async function createBlogPost(data: NewBlogPost) {
  const [row] = await db.insert(blogPosts).values(data).returning();
  return row;
}

export async function updateBlogPost(id: number, data: Partial<NewBlogPost>) {
  const [row] = await db
    .update(blogPosts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(blogPosts.id, id))
    .returning();
  return row ?? null;
}

export async function deleteBlogPost(id: number) {
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}
