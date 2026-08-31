import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { addBooking, getBookings, Booking } from "@/lib/store";
import { getCarBySlug } from "@/lib/cars";

// Optional admin protection for listing bookings
function isAdmin(req: NextRequest): boolean {
  const key = process.env.ADMIN_KEY || "viraj-admin";
  const provided =
    req.headers.get("x-admin-key") ||
    req.nextUrl.searchParams.get("key") ||
    "";
  return provided === key;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ bookings: getBookings() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      carSlug,
      customerName,
      phone,
      email,
      pickupDate,
      returnDate,
      mode,
      paymentMethod,
      paymentId,
    } = body;

    if (!carSlug || !customerName || !phone || !pickupDate || !returnDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const car = getCarBySlug(carSlug);
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const days = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );

    const chauffeurSurcharge = mode === "chauffeur" ? 2500 * days : 0;
    const amount = car.pricePerDay * days + chauffeurSurcharge;

    const booking: Booking = {
      id: "VC-" + crypto.randomBytes(4).toString("hex").toUpperCase(),
      carSlug,
      carName: `${car.brand} ${car.name}`,
      customerName,
      phone,
      email: email || "",
      pickupDate,
      returnDate,
      days,
      mode: mode === "chauffeur" ? "chauffeur" : "self-drive",
      paymentMethod: paymentMethod === "online" ? "online" : "cod",
      amount,
      status: paymentMethod === "online" && paymentId ? "confirmed" : "pending",
      paymentId: paymentId || undefined,
      createdAt: new Date().toISOString(),
    };

    addBooking(booking);

    return NextResponse.json({ success: true, booking });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
