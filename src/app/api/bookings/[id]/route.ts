import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus, Booking } from "@/lib/store";

function isAdmin(req: NextRequest): boolean {
  const key = process.env.ADMIN_KEY || "viraj-admin";
  const provided = req.headers.get("x-admin-key") || "";
  return provided === key;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { status } = await req.json();
  const valid: Booking["status"][] = ["pending", "confirmed", "completed", "cancelled"];
  if (!valid.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const updated = updateBookingStatus(params.id, status);
  if (!updated) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, booking: updated });
}
