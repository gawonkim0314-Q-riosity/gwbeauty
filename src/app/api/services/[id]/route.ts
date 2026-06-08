import { NextRequest, NextResponse } from "next/server";
import {
  deleteService,
  getServiceById,
  updateService,
} from "@/db/queries";
import { requireStaff } from "@/lib/auth/server-auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const service = await getServiceById(Number(id));
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(service);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireStaff(request);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateService(Number(id), body);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT /api/services/[id]]", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireStaff(request);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateService(Number(id), body);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/services/[id]]", error);
    return NextResponse.json({ error: "Failed to patch" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireStaff(request);
  if (error) return error;

  try {
    const { id } = await params;
    await deleteService(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/services/[id]]", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
