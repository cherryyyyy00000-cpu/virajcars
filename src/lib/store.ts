import fs from "fs";
import path from "path";

export type Booking = {
  id: string;
  carSlug: string;
  carName: string;
  customerName: string;
  phone: string;
  email: string;
  pickupDate: string;
  returnDate: string;
  days: number;
  mode: "self-drive" | "chauffeur";
  paymentMethod: "online" | "cod";
  amount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentId?: string;
  createdAt: string;
};

/**
 * Lightweight file-based store for bookings.
 *
 * NOTE: On serverless platforms (Vercel) the filesystem is ephemeral, so this
 * persists only within a running instance. For production, swap this for a real
 * database (Vercel Postgres, Supabase, MongoDB, etc.) — the function signatures
 * below are designed to make that migration painless.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "bookings.json");

// In-memory fallback (used when filesystem is read-only)
let memory: Booking[] = [];

function ensureFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
  } catch {
    /* read-only fs — use memory */
  }
}

export function getBookings(): Booking[] {
  ensureFile();
  try {
    const raw = fs.readFileSync(FILE, "utf-8");
    return JSON.parse(raw) as Booking[];
  } catch {
    return memory;
  }
}

export function addBooking(booking: Booking): Booking {
  const all = getBookings();
  all.unshift(booking);
  try {
    fs.writeFileSync(FILE, JSON.stringify(all, null, 2), "utf-8");
  } catch {
    memory = all;
  }
  return booking;
}

export function updateBookingStatus(id: string, status: Booking["status"]): Booking | null {
  const all = getBookings();
  const idx = all.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  all[idx].status = status;
  try {
    fs.writeFileSync(FILE, JSON.stringify(all, null, 2), "utf-8");
  } catch {
    memory = all;
  }
  return all[idx];
}
