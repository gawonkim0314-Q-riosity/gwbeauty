import { NextResponse } from "next/server";
import { getDashboardStats } from "@/db/queries";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[GET /api/stats]", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
