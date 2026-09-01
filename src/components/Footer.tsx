import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { SITE } from "@/lib/site";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative z-10 border-t border-ink-line bg-ink-soft"
    >
      <div className="container-x grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size={40} showTagline />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/60">
            {SITE.motto}. Serving {SITE.city} with self-drive and chauffeur-driven cars,
            delivered to your doorstep.
          </p>
          <p className="mt-6 text-xs text-foreground/40">
            GSTIN: <span className="font-mono text-foreground/60">{SITE.gstin}</span>
          </p>
        </div>

        <div>
          <h4 className="section-label mb-4">Explore</h4>
          <ul className="space-y-3 text-sm text-foreground/60">
            <li><Link href="/cars" className="hover:text-brand-light">Our Cars</Link></li>
            <li><Link href="/#experience" className="hover:text-brand-light">How It Works</Link></li>
            <li><Link href="/credits" className="hover:text-brand-light">Photo Credits</Link></li>
            <li><Link href="/admin" className="hover:text-brand-light">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="section-label mb-4">Reach Us</h4>
          <ul className="space-y-3 text-sm text-foreground/60">
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-brand" /> {SITE.city}, {SITE.state}
            </li>
            {SITE.contacts.map((c) => (
              <li key={c.phone} className="flex items-start gap-2">
                <Phone size={15} className="mt-0.5 text-brand" />
                <a href={`tel:${c.phone}`} className="hover:text-brand-light">
                  {c.name}
                  <span className="block text-xs text-foreground/40">{c.display}</span>
                </a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-brand" />
              <a href={`mailto:${SITE.email}`} className="hover:text-brand-light">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-line py-6">
        <div className="container-x flex flex-col items-center justify-between gap-2 text-xs text-foreground/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>{SITE.tagline} · Made in {SITE.city} 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
