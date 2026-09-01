import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorker from "@/components/ServiceWorker";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";
import InstallPWA from "@/components/InstallPWA";
import { SITE } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://virajrides.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE.name,
  title: {
    default: `${SITE.name} — Car Rental in ${SITE.city} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Rent all types of cars in Jaipur at affordable prices — Swift, Dzire, Ertiga, Creta, Innova Crysta, Thar, Scorpio, Fortuner and Mercedes E-Class for weddings. Self-drive or with driver. Reliable service, comfortable rides.",
  keywords: [
    "car rental Jaipur",
    "self drive cars Jaipur",
    "Innova Crysta rental Jaipur",
    "wedding car rental Jaipur",
    "Fortuner rent Jaipur",
    "Thar rent Jaipur",
    "cheap car rental Jaipur",
    "ViRaj Rides",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE.name,
  },
  openGraph: {
    title: `${SITE.name} — Car Rental in ${SITE.city}`,
    description: "All types of cars on rent in Jaipur at affordable prices. Book online instantly.",
    url: SITE_URL,
    siteName: SITE.name,
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ServiceWorker />
        <Navbar />
        <main className="relative">{children}</main>
        <WhatsAppButton />
        <ChatBot />
        <InstallPWA />
        <Footer />
      </body>
    </html>
  );
}
