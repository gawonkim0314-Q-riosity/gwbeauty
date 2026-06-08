import { db } from "@/db";
import { users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import type { UserRole } from "@/db/schema";

const BOOTSTRAP_ADMIN_EMAILS = (
  process.env.ADMIN_BOOTSTRAP_EMAILS ?? "linking204@naver.com"
)
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function resolveRoleForEmail(email: string): UserRole {
  return BOOTSTRAP_ADMIN_EMAILS.includes(email.toLowerCase())
    ? "admin"
    : "member";
}

export type UpsertUserInput = {
  firebaseUid: string;
  email: string;
  displayName?: string | null;
  photoUrl?: string | null;
};

export async function upsertUserFromFirebase(data: UpsertUserInput) {
  const now = new Date();
  const bootstrapAdmin = BOOTSTRAP_ADMIN_EMAILS.includes(
    data.email.toLowerCase()
  );

  const [row] = await db
    .insert(users)
    .values({
      firebaseUid: data.firebaseUid,
      email: data.email,
      displayName: data.displayName ?? null,
      photoUrl: data.photoUrl ?? null,
      role: resolveRoleForEmail(data.email),
      lastLoginAt: now,
    })
    .onConflictDoUpdate({
      target: users.firebaseUid,
      set: {
        email: data.email,
        displayName: data.displayName ?? null,
        photoUrl: data.photoUrl ?? null,
        lastLoginAt: now,
        updatedAt: now,
        ...(bootstrapAdmin ? { role: "admin" as const } : {}),
      },
    })
    .returning();
  return row;
}

export async function getUserByFirebaseUid(firebaseUid: string) {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.firebaseUid, firebaseUid))
    .limit(1);
  return row ?? null;
}

export async function listUsers() {
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function getUserById(id: string) {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row ?? null;
}

export async function updateUserRole(
  id: string,
  role: UserRole,
  isActive: boolean
) {
  const now = new Date();
  const [row] = await db
    .update(users)
    .set({ role, isActive, updatedAt: now })
    .where(eq(users.id, id))
    .returning();
  return row ?? null;
}

export async function grantAdminByEmail(email: string) {
  const now = new Date();
  const [row] = await db
    .update(users)
    .set({ role: "admin", updatedAt: now })
    .where(eq(users.email, email.toLowerCase()))
    .returning();
  return row ?? null;
}

export async function countAdmins(excludeUserId?: string) {
  const all = await db
    .select({ id: users.id, role: users.role, isActive: users.isActive })
    .from(users);
  return all.filter(
    (u) =>
      u.role === "admin" &&
      u.isActive !== false &&
      u.id !== excludeUserId
  ).length;
}
