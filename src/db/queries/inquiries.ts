import { db } from "@/db";
import { inquiries, type NewInquiry } from "@/db/schema";
import {
  and,
  desc,
  eq,
  ilike,
  isNotNull,
  isNull,
  or,
  sql,
} from "drizzle-orm";

export type InquiryListParams = {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  /** true = 답변 완료, false = 미답변, all/undefined = 전체 */
  replied?: "true" | "false" | "all";
};

export type InquiryListResult = {
  items: (typeof inquiries.$inferSelect)[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function buildWhere(params: InquiryListParams) {
  const conditions = [];

  if (params.status && params.status !== "all") {
    conditions.push(eq(inquiries.status, params.status));
  }

  if (params.search?.trim()) {
    const q = `%${params.search.trim()}%`;
    conditions.push(
      or(
        ilike(inquiries.name, q),
        ilike(inquiries.phone, q),
        ilike(inquiries.email, q),
        ilike(inquiries.message, q),
        ilike(inquiries.service, q)
      )
    );
  }

  if (params.replied === "true") {
    conditions.push(isNotNull(inquiries.adminReply));
  } else if (params.replied === "false") {
    conditions.push(isNull(inquiries.adminReply));
  }

  return conditions.length ? and(...conditions) : undefined;
}

export async function listInquiriesPaginated(
  params: InquiryListParams = {}
): Promise<InquiryListResult> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(50, Math.max(1, params.limit ?? 10));
  const offset = (page - 1) * limit;
  const where = buildWhere(params);

  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(where);

  const total = countRow?.count ?? 0;

  const items = await db
    .select()
    .from(inquiries)
    .where(where)
    .orderBy(desc(inquiries.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

/** @deprecated admin 목록 — paginated API 사용 권장 */
export async function listInquiries() {
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

export async function getInquiryById(id: number) {
  const [row] = await db.select().from(inquiries).where(eq(inquiries.id, id));
  return row ?? null;
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

export async function countInquiriesByStatus() {
  const rows = await db
    .select({
      status: inquiries.status,
      count: sql<number>`count(*)::int`,
    })
    .from(inquiries)
    .groupBy(inquiries.status);

  const counts: Record<string, number> = {
    pending: 0,
    contacted: 0,
    completed: 0,
    cancelled: 0,
  };
  for (const row of rows) {
    if (row.status) counts[row.status] = row.count;
  }

  const [unansweredRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(isNull(inquiries.adminReply));

  return {
    ...counts,
    unanswered: unansweredRow?.count ?? 0,
    total: Object.values(counts).reduce((a, b) => a + b, 0),
  };
}
