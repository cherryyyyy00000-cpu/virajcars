import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Sparkles, Star, Phone } from "lucide-react";
import ShowroomEntrance from "@/components/showroom/ShowroomEntrance";
import ShowroomJourney from "@/components/showroom/ShowroomJourney";
import Reveal from "@/components/Reveal";
import { SITE, waLink } from "@/lib/site";

const STATS = [
  { value: "10+", label: "Cars in Our Fleet" },
  { value: "1000+", label: "Happy Journeys" },
  { value: "4.8★", label: "Average Rating" },
  { value: "24/7", label: "Customer Support" },
];

const STEPS = [
  { icon: Sparkles, title: "Choose Your Car", desc: "Walk through our showroom and pick the car that fits your plan and budget." },
  { icon: Clock, title: "Select Date & Time", desc: "Choose pickup date, duration and location — self-drive or with a driver." },
  { icon: ShieldCheck, title: "Pay & Confirm", desc: "Pay online or choose Cash on Delivery. Instant confirmation on WhatsApp." },
];

const REVIEWS = [
  { name: "Rahul Sharma", text: "Booked the Mercedes E-Class for my wedding. Spotless car, on-time delivery. Thank you ViRaj Rides!", car: "Mercedes E-Class" },
  { name: "Ananya Mehta", text: "Took the Innova Crysta for our Ranthambore trip. Super comfortable and the driver was very professional.", car: "Toyota Innova Crysta" },
  { name: "Vikram Singh", text: "Affordable prices and reliable service. The Creta was in mint condition for our family outing.", car: "Hyundai Creta" },
];

export default function Home() {
  return (
    <>
      {/* ===== HERO = SHOWROOM ENTRANCE (doors open, car configurator) ===== */}
      <ShowroomEntrance />

      {/* ========= WALK THROUGH THE SHOWROOM (car bays) ========= */}
      <ShowroomJourney />

      {/* ================= STATS ================= */}
      <section className="relative z-10 border-y border-ink-line bg-ink-soft">
        <div className="container-x grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="text-center">
              <p className="font-display text-4xl font-bold brand-text">{s.value}</p>
              <p className="mt-1 text-sm text-foreground/50">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="experience"
        className="relative z-10 border-y border-ink-line bg-ink-soft py-24"
      >
        <div className="container-x">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <p className="section-label">How It Works</p>
            <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              Booking in <span className="brand-text">Three Steps</span>
            </h2>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className="card-luxury h-full p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand/30 bg-brand/5">
                    <step.icon className="text-brand" size={26} />
                  </div>
                  <div className="mt-5 font-display text-5xl font-bold text-ink-line">
                    0{i + 1}
                  </div>
                  <h3 className="mt-2 font-display text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/50">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <section className="relative z-10 py-24">
        <div className="container-x">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <p className="section-label">Testimonials</p>
            <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              Trusted by <span className="brand-text">{SITE.city}</span>
            </h2>
          </Reveal>

          <div className="grid gap-7 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.08}>
                <div className="card-luxury h-full p-8">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} size={16} className="fill-brand text-brand" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                    &ldquo;{r.text}&rdquo;
                  </p>
                  <div className="mt-6 border-t border-ink-line pt-4">
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-brand">{r.car}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative z-10 pb-24">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-ink-card to-ink-soft p-12 text-center md:p-20">
              <div className="pointer-events-none absolute inset-0 bg-radial-brand" />
              <div className="relative">
                <h2 className="font-display text-4xl font-bold sm:text-5xl">
                  Ready for Your Next Ride?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-foreground/60">
                  Book in minutes and we&apos;ll deliver the car to your doorstep anywhere
                  in {SITE.city}.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link href="/cars" className="btn-brand">
                    Book Your Car <ArrowRight size={17} />
                  </Link>
                  <a href={`tel:${SITE.phonePrimary}`} className="btn-outline">
                    <Phone size={15} /> {SITE.phonePrimaryDisplay}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
