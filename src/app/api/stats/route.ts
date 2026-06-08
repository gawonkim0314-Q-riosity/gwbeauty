import { NextRequest, NextResponse } from "next/server";
import { getDashboardStats } from "@/db/queries";
import { requireStaff } from "@/lib/auth/server-auth";

export async function GET(request: NextRequest) {
  const { error } = await requireStaff(request);
  if (error) return error;

  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[GET /api/stats]", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
