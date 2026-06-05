import { db } from "@/db";
import { blogPosts, type NewBlogPost } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function listBlogPosts(publishedOnly: boolean) {
  const q = db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  if (publishedOnly) {
    return q.where(eq(blogPosts.isPublished, true));
  }
  return q;
}

export async function getBlogPostById(id: number) {
  const [row] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
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
