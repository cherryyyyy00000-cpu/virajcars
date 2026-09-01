"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard,
  IndianRupee,
  CalendarCheck,
  Clock,
  Lock,
  RefreshCw,
  Car as CarIcon,
} from "lucide-react";
import type { Booking } from "@/lib/store";
import { CARS } from "@/lib/cars";
import { formatINR, cn } from "@/lib/utils";

const STATUS_STYLES: Record<Booking["status"], string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  completed: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(
    async (adminKey: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/bookings?key=${encodeURIComponent(adminKey)}`);
        if (res.status === 401) {
          setError("Wrong admin key. Try again.");
          setAuthed(false);
          return;
        }
        const data = await res.json();
        setBookings(data.bookings || []);
        setAuthed(true);
        if (typeof window !== "undefined") sessionStorage.setItem("vc_admin", adminKey);
      } catch {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem("vc_admin") : null;
    if (saved) {
      setKey(saved);
      fetchBookings(saved);
    }
  }, [fetchBookings]);

  async function changeStatus(id: string, status: Booking["status"]) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ status }),
    });
    fetchBookings(key);
  }

  // Stats
  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.amount, 0);
  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5 pt-20">
        <div className="card-luxury w-full max-w-sm p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brand/30 bg-brand/5">
            <Lock className="text-brand" size={24} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold">Admin Access</h1>
          <p className="mt-1 text-sm text-foreground/50">
            Enter your admin key to manage bookings.
          </p>
          <input
            type="password"
            placeholder="Admin key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchBookings(key)}
            className="mt-5 w-full rounded-xl border border-ink-line bg-ink px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          <button onClick={() => fetchBookings(key)} className="btn-brand mt-4 w-full">
            {loading ? "Checking…" : "Enter Dashboard"}
          </button>
          <p className="mt-4 text-[11px] text-foreground/30">
            Default key: <span className="font-mono">viraj-admin</span> (change via
            ADMIN_KEY env var)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x pt-28 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="text-brand" />
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <button
          onClick={() => fetchBookings(key)}
          className="btn-outline !py-2 !px-4"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={IndianRupee} label="Total Revenue" value={formatINR(totalRevenue)} />
        <StatCard icon={CalendarCheck} label="Total Bookings" value={`${bookings.length}`} />
        <StatCard icon={Clock} label="Pending" value={`${pending}`} />
        <StatCard icon={CarIcon} label="Confirmed" value={`${confirmed}`} />
      </div>

      {/* Fleet overview */}
      <h2 className="mt-12 font-display text-xl font-bold">Fleet ({CARS.length} cars)</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {CARS.map((c) => (
          <div key={c.id} className="card-luxury p-4">
            <p className="text-xs text-brand">{c.brand}</p>
            <p className="font-semibold">{c.name}</p>
            <p className="mt-1 text-sm text-foreground/50">{formatINR(c.pricePerDay)}/day</p>
            <span
              className={cn(
                "mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px]",
                c.available
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              )}
            >
              {c.available ? "Available" : "Booked"}
            </span>
          </div>
        ))}
      </div>

      {/* Bookings table */}
      <h2 className="mt-12 font-display text-xl font-bold">Bookings</h2>
      {bookings.length === 0 ? (
        <div className="card-luxury mt-4 p-10 text-center text-foreground/40">
          No bookings yet. They&apos;ll appear here as customers reserve cars.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-foreground/40">
                <th className="px-4 py-2">Booking</th>
                <th className="px-4 py-2">Car</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Dates</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Pay</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="bg-ink-card">
                  <td className="rounded-l-xl px-4 py-3 font-mono text-xs text-brand">{b.id}</td>
                  <td className="px-4 py-3">{b.carName}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{b.customerName}</p>
                    <p className="text-xs text-foreground/40">{b.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground/60">
                    {b.pickupDate} → {b.returnDate}
                    <span className="block text-foreground/30">{b.days} day(s) · {b.mode}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatINR(b.amount)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-ink-line px-2 py-0.5 text-[10px] uppercase">
                      {b.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize",
                        STATUS_STYLES[b.status]
                      )}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="rounded-r-xl px-4 py-3">
                    <select
                      value={b.status}
                      onChange={(e) => changeStatus(b.id, e.target.value as Booking["status"])}
                      className="rounded-lg border border-ink-line bg-ink px-2 py-1 text-xs outline-none focus:border-brand"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="card-luxury p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground/50">{label}</span>
        <Icon className="text-brand" size={18} />
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}
