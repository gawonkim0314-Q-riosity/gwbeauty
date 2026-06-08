import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export type UpsertUserInput = {
  firebaseUid: string;
  email: string;
  displayName?: string | null;
  photoUrl?: string | null;
};

export async function upsertUserFromFirebase(data: UpsertUserInput) {
  const now = new Date();
  const [row] = await db
    .insert(users)
    .values({
      firebaseUid: data.firebaseUid,
      email: data.email,
      displayName: data.displayName ?? null,
      photoUrl: data.photoUrl ?? null,
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
