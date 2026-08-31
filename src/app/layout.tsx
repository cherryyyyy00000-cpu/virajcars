import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorker from "@/components/ServiceWorker";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://virajrides.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ViRaj Rides — Car Rental in Jaipur | Miles and Smiles",
    template: "%s | ViRaj Rides Jaipur",
  },
  description:
    "Rent all types of cars in Jaipur at affordable prices — Swift, Dzire, Innova Crysta, Creta, Fortuner, Thar & luxury cars for weddings. Self-drive or chauffeur. Reliable service, comfortable rides.",
  keywords: [
    "car rental Jaipur",
    "self drive cars Jaipur",
    "Innova Crysta rental Jaipur",
    "wedding car rental Jaipur",
    "Fortuner rent Jaipur",
    "cheap car rental Jaipur",
    "ViRaj Rides",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ViRaj Rides",
  },
  openGraph: {
    title: "ViRaj Rides — Car Rental in Jaipur | Miles and Smiles",
    description:
      "All types of cars on rent in Jaipur at affordable prices. Self-drive or chauffeur. Book online instantly.",
    url: SITE_URL,
    siteName: "ViRaj Rides",
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans showroom-vignette`}
      >
        <ServiceWorker />
        <Navbar />
        <main className="relative z-[2]">{children}</main>
        <WhatsAppButton />
        <ChatBot />
        <Footer />
      </body>
    </html>
  );
}
