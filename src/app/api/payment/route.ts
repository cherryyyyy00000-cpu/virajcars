import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Creates a Razorpay order for online payment.
 *
 * Requires env vars:
 *   RAZORPAY_KEY_ID
 *   RAZORPAY_KEY_SECRET
 *
 * If keys are absent, returns { demo: true } so the frontend can run a
 * simulated success flow during development (no real charge).
 */
export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Demo mode — no keys configured yet
    if (!keyId || !keySecret) {
      return NextResponse.json({
        demo: true,
        message: "Razorpay keys not configured. Running in demo mode.",
      });
    }

    // Lazy import so the app builds even without the SDK at build time
    const Razorpay = (await import("razorpay")).default;
    const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await instance.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: "rcpt_" + crypto.randomBytes(4).toString("hex"),
    });

    return NextResponse.json({
      demo: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err) {
    console.error("Payment error:", err);
    return NextResponse.json({ error: "Payment init failed" }, { status: 500 });
  }
}
