# ViRaj Rides 🚗 — Luxury Car Rental (Jaipur)

> **Miles and Smiles** — All types of cars on rent at affordable prices.

A modern, installable **PWA** (website + app) for **ViRaj Rides**, a car rental business in Jaipur. Built with Next.js, featuring an interactive **3D car showroom**, online booking with **Razorpay + Cash on Delivery**, an **admin dashboard**, and an **AI chatbot** for customer queries.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-blue) ![Three.js](https://img.shields.io/badge/Three.js-3D-green) ![PWA](https://img.shields.io/badge/PWA-installable-orange)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **Ultra-luxury theme** | Dark + gold showroom aesthetic with smooth scroll animations (Framer Motion) |
| 🏎️ **3D rotating cars** | Interactive Three.js car that rotates on drag and floats — drag to explore |
| 🚙 **10-car fleet** | Swift, Dzire, Creta, Ertiga, Innova Crysta, Thar, Scorpio-N, Verna, Fortuner, Mercedes E-Class |
| 📅 **Online booking** | Date selection, self-drive/chauffeur, live price calculation |
| 💳 **Payments** | Razorpay (online) + Cash on Delivery. Demo mode works without keys |
| 🛠️ **Admin dashboard** | View bookings, revenue, manage status — protected by admin key at `/admin` |
| 🤖 **AI chatbot** | Answers customer queries (cars, prices, docs, booking). Works free out-of-the-box, upgrades to OpenAI with a key |
| 📱 **PWA** | Installable on phones (Add to Home Screen), offline support, app icons |
| 🔍 **SEO ready** | Metadata, Open Graph, keywords for "car rental Jaipur" |
| 💬 **WhatsApp** | Floating WhatsApp button + booking confirmation via WhatsApp |

---

## 🚀 Getting Started (Local)

```bash
npm install
cp .env.example .env.local   # then fill values (optional)
npm run dev                  # http://localhost:3000
```

Production build:

```bash
npm run build && npm run start
```

---

## 🔑 Environment Variables

See [`.env.example`](./.env.example). All are **optional** — the app works fully without them (payments run in demo mode, chatbot uses the free responder).

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your live domain (for SEO) |
| `ADMIN_KEY` | Password for the `/admin` dashboard (**change this!**) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Enable real online payments |
| `OPENAI_API_KEY` | Enable AI-powered chatbot replies |

---

## ☁️ Deploy to Vercel (Free)

1. Push this repo to GitHub (already done).
2. Go to **[vercel.com](https://vercel.com)** → sign in with GitHub.
3. Click **Add New → Project** → import the `virajcars` repo.
4. Framework preset auto-detects **Next.js** — leave defaults.
5. (Optional) Add environment variables from the table above.
6. Click **Deploy**. Your site goes live at `https://<project>.vercel.app` 🎉

Every future `git push` to `main` auto-deploys.

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage (3D hero, fleet, reviews)
│   ├── cars/                 # Fleet list + [slug] detail with booking
│   ├── admin/                # Admin dashboard
│   └── api/                  # bookings, payment, chat endpoints
├── components/
│   ├── three/                # 3D car model + scene (React Three Fiber)
│   ├── BookingForm.tsx       # Booking + Razorpay/COD
│   ├── ChatBot.tsx           # AI assistant widget
│   └── ...                   # Navbar, Footer, CarCard, etc.
└── lib/
    ├── cars.ts               # Fleet data (edit prices/cars here)
    ├── site.ts               # Business info (name, phones, GSTIN)
    ├── store.ts              # Booking storage
    └── chat.ts               # Chatbot knowledge base
```

## ✏️ Common Edits

- **Change car prices / add cars:** edit `src/lib/cars.ts`
- **Update phone / business info:** edit `src/lib/site.ts`
- **Chatbot answers:** edit `src/lib/chat.ts`

---

## ⚠️ Production Note

Booking data currently uses a lightweight file store (`src/lib/store.ts`), which resets on serverless redeploys. For real production, connect a database (Vercel Postgres, Supabase, or MongoDB) — the store functions are structured for an easy swap.

---

_Built for ViRaj Rides · Jaipur, Rajasthan · GSTIN 08ABCFV5541Q1ZI_
