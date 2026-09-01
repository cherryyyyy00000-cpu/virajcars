import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { SITE } from "@/lib/site";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="relative z-[2] border-t border-ink-line bg-ink-soft">
      <div className="container-x grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="font-display text-3xl font-bold">
            <span className="gold-text">{SITE.brandLead}</span> {SITE.brandTail}
          </span>
          <p className="mt-1 text-sm italic text-gold/70">{SITE.tagline}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/60">
            {SITE.city}&apos;s trusted car rental — all types of cars at affordable prices.
            Reliable service and comfortable rides, self-drive or chauffeur-driven,
            delivered to your doorstep.
          </p>
          <div className="mt-6 flex gap-4">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors hover:bg-gold/10"
            >
              <InstagramIcon size={18} />
            </a>
          </div>
          <p className="mt-6 text-xs text-foreground/40">
            GSTIN: <span className="font-mono text-foreground/60">{SITE.gstin}</span>
          </p>
          <p className="mt-3 text-[10px] leading-relaxed text-foreground/25">
            3D showroom model &ldquo;Car Concept&rdquo; by Eric Chadwick / Darmstadt Graphics
            Group, licensed{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noreferrer noopener"
              className="underline hover:text-gold/60"
            >
              CC BY 4.0
            </a>
            .
          </p>
        </div>

        <div>
          <h4 className="section-label mb-4">Explore</h4>
          <ul className="space-y-3 text-sm text-foreground/60">
            <li><Link href="/cars" className="hover:text-gold-light">Our Fleet</Link></li>
            <li><Link href="/#experience" className="hover:text-gold-light">How It Works</Link></li>
            <li><Link href="/admin" className="hover:text-gold-light">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="section-label mb-4">Reach Us</h4>
          <ul className="space-y-3 text-sm text-foreground/60">
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-gold" /> {SITE.city}, {SITE.state}
            </li>
            {SITE.contacts.map((c) => (
              <li key={c.phone} className="flex items-center gap-2">
                <Phone size={15} className="text-gold" />
                <a href={`tel:${c.phone}`} className="hover:text-gold-light">
                  {c.name} · {c.display}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-gold" />
              <a href={`mailto:${SITE.email}`} className="hover:text-gold-light">{SITE.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-line py-6">
        <div className="container-x flex flex-col items-center justify-between gap-2 text-xs text-foreground/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Crafted with precision in {SITE.city} 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
