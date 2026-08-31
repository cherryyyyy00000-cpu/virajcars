"use client";

import { useMemo, useState } from "react";
import Script from "next/script";
import { CheckCircle2, Loader2, CalendarDays, CreditCard, Banknote } from "lucide-react";
import { Car } from "@/lib/cars";
import { formatINR, cn } from "@/lib/utils";
import { waLink } from "@/lib/site";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const CHAUFFEUR_PER_DAY = 2500;

export default function BookingForm({ car }: { car: Car }) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    pickupDate: today,
    returnDate: today,
    mode: "self-drive" as "self-drive" | "chauffeur",
    paymentMethod: "cod" as "online" | "cod",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<null | { id: string }>(null);
  const [error, setError] = useState("");

  const days = useMemo(() => {
    const start = new Date(form.pickupDate);
    const end = new Date(form.returnDate);
    return Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1
    );
  }, [form.pickupDate, form.returnDate]);

  const total = useMemo(() => {
    const chauffeur = form.mode === "chauffeur" ? CHAUFFEUR_PER_DAY * days : 0;
    return car.pricePerDay * days + chauffeur;
  }, [days, form.mode, car.pricePerDay]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function createBooking(paymentId?: string) {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, carSlug: car.slug, paymentId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Booking failed");
    return data.booking;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.customerName || !form.phone) {
      setError("Please enter your name and phone number.");
      return;
    }
    setLoading(true);

    try {
      if (form.paymentMethod === "cod") {
        const booking = await createBooking();
        setSuccess({ id: booking.id });
        setLoading(false);
        return;
      }

      // Online payment via Razorpay
      const orderRes = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const order = await orderRes.json();

      // Demo mode — no keys configured; simulate success
      if (order.demo) {
        const booking = await createBooking("DEMO-PAYMENT");
        setSuccess({ id: booking.id });
        setLoading(false);
        return;
      }

      if (!window.Razorpay) {
        throw new Error("Payment SDK failed to load. Try COD instead.");
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "VirajCars",
        description: `${car.brand} ${car.name} — ${days} day(s)`,
        order_id: order.orderId,
        prefill: {
          name: form.customerName,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#C9A24B" },
        handler: async (response: any) => {
          try {
            const booking = await createBooking(response.razorpay_payment_id);
            setSuccess({ id: booking.id });
          } catch (err: any) {
            setError(err.message || "Booking failed after payment.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  }

  if (success) {
    const waHref = waLink(
      `Hi ViRaj Rides! I just booked the ${car.brand} ${car.name} (Booking ID: ${success.id}). Please confirm.`
    );
    return (
      <div className="card-luxury p-8 text-center">
        <CheckCircle2 className="mx-auto text-gold" size={56} />
        <h3 className="mt-4 font-display text-2xl font-bold">Booking Confirmed!</h3>
        <p className="mt-2 text-sm text-foreground/60">
          Your booking ID is{" "}
          <span className="font-mono font-semibold text-gold">{success.id}</span>.
          Our concierge will contact you shortly.
        </p>
        <a href={waHref} target="_blank" rel="noreferrer" className="btn-gold mt-6">
          Confirm on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <form onSubmit={handleSubmit} className="card-luxury p-6 sm:p-8">
        <h3 className="font-display text-2xl font-bold">
          Reserve this <span className="gold-text">{car.name}</span>
        </h3>

        {/* Dates */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground/60">
              <CalendarDays size={13} /> Pickup
            </span>
            <input
              type="date"
              min={today}
              value={form.pickupDate}
              onChange={(e) => update("pickupDate", e.target.value)}
              className="w-full rounded-xl border border-ink-line bg-ink px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground/60">
              <CalendarDays size={13} /> Return
            </span>
            <input
              type="date"
              min={form.pickupDate}
              value={form.returnDate}
              onChange={(e) => update("returnDate", e.target.value)}
              className="w-full rounded-xl border border-ink-line bg-ink px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold"
            />
          </label>
        </div>

        {/* Mode */}
        <div className="mt-5">
          <span className="mb-2 block text-xs font-medium text-foreground/60">Drive Mode</span>
          <div className="grid grid-cols-2 gap-3">
            {(["self-drive", "chauffeur"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => update("mode", m)}
                className={cn(
                  "rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition-all",
                  form.mode === m
                    ? "border-gold bg-gold/10 text-gold-light"
                    : "border-ink-line text-foreground/60 hover:border-gold/40"
                )}
              >
                {m.replace("-", " ")}
                {m === "chauffeur" && (
                  <span className="block text-[10px] text-foreground/40">
                    +{formatINR(CHAUFFEUR_PER_DAY)}/day
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Customer details */}
        <div className="mt-5 space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={form.customerName}
            onChange={(e) => update("customerName", e.target.value)}
            className="w-full rounded-xl border border-ink-line bg-ink px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full rounded-xl border border-ink-line bg-ink px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-xl border border-ink-line bg-ink px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>

        {/* Payment method */}
        <div className="mt-5">
          <span className="mb-2 block text-xs font-medium text-foreground/60">Payment</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => update("paymentMethod", "online")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                form.paymentMethod === "online"
                  ? "border-gold bg-gold/10 text-gold-light"
                  : "border-ink-line text-foreground/60 hover:border-gold/40"
              )}
            >
              <CreditCard size={16} /> Pay Online
            </button>
            <button
              type="button"
              onClick={() => update("paymentMethod", "cod")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                form.paymentMethod === "cod"
                  ? "border-gold bg-gold/10 text-gold-light"
                  : "border-ink-line text-foreground/60 hover:border-gold/40"
              )}
            >
              <Banknote size={16} /> Cash on Delivery
            </button>
          </div>
        </div>

        {/* Price summary */}
        <div className="mt-6 space-y-2 border-t border-ink-line pt-5 text-sm">
          <div className="flex justify-between text-foreground/60">
            <span>{formatINR(car.pricePerDay)} × {days} day(s)</span>
            <span>{formatINR(car.pricePerDay * days)}</span>
          </div>
          {form.mode === "chauffeur" && (
            <div className="flex justify-between text-foreground/60">
              <span>Chauffeur × {days} day(s)</span>
              <span>{formatINR(CHAUFFEUR_PER_DAY * days)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 font-display text-xl font-bold">
            <span>Total</span>
            <span className="gold-text">{formatINR(total)}</span>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading} className="btn-gold mt-6 w-full">
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" /> Processing…
            </>
          ) : form.paymentMethod === "online" ? (
            `Pay ${formatINR(total)} & Book`
          ) : (
            "Confirm Booking (COD)"
          )}
        </button>
        <p className="mt-3 text-center text-[11px] text-foreground/30">
          🔒 Secure booking · Free cancellation up to 24h before pickup
        </p>
      </form>
    </>
  );
}
