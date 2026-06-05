import { db } from "@/db";
import { inquiries, type NewInquiry } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function listInquiries() {
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

export async function createInquiry(data: NewInquiry) {
  const [row] = await db.insert(inquiries).values(data).returning();
  return row;
}

export async function updateInquiry(id: number, data: Partial<NewInquiry>) {
  const [row] = await db
    .update(inquiries)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(inquiries.id, id))
    .returning();
  return row ?? null;
}

export async function deleteInquiry(id: number) {
  await db.delete(inquiries).where(eq(inquiries.id, id));
}
