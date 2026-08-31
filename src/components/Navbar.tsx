"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Fleet" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-white/5 bg-ink/80 py-3 backdrop-blur-xl"
          : "bg-transparent py-5"
      )}
    >
      <nav className="container-x flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <span className="font-display text-2xl font-bold tracking-tight">
            <span className="gold-text">{SITE.brandLead}</span>
            <span className="text-foreground"> {SITE.brandTail}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-gold-light"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a href={`tel:${SITE.phonePrimary}`} className="btn-outline !py-2.5 !px-5">
            <Phone size={15} /> Call
          </a>
          <Link href="/cars" className="btn-gold !py-2.5 !px-5">
            Book Now
          </Link>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="container-x mt-4 flex flex-col gap-4 border-t border-white/5 pt-4 md:hidden">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-base font-medium text-foreground/80"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/cars" onClick={() => setOpen(false)} className="btn-gold mt-2">
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}
