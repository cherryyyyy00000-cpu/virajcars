import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Sparkles, MapPin, Star } from "lucide-react";
import HeroVisual from "@/components/HeroVisual";
import ScrollShowroom from "@/components/ScrollShowroom";
import CarCard from "@/components/CarCard";
import Reveal from "@/components/Reveal";
import { CARS, getCarBySlug } from "@/lib/cars";
import { SITE, waLink } from "@/lib/site";

const STATS = [
  { value: "10+", label: "Cars in Our Fleet" },
  { value: "1000+", label: "Happy Journeys" },
  { value: "4.8★", label: "Average Rating" },
  { value: "24/7", label: "Customer Support" },
];

const STEPS = [
  { icon: Sparkles, title: "Choose Your Car", desc: "Browse our curated fleet of ultra-luxury vehicles and pick your dream ride." },
  { icon: Clock, title: "Select Date & Time", desc: "Pick your pickup date, duration and location — self-drive or chauffeur." },
  { icon: ShieldCheck, title: "Pay & Confirm", desc: "Secure online payment or Cash on Delivery. Instant confirmation." },
];

const REVIEWS = [
  { name: "Rahul Sharma", text: "Booked the Mercedes E-Class for my wedding. Spotless car, on-time delivery, felt truly special. Thank you ViRaj Rides!", car: "Mercedes E-Class" },
  { name: "Ananya Mehta", text: "Took the Innova Crysta for our Ranthambore trip. Super comfortable, clean and the driver was very professional. Highly recommend.", car: "Toyota Innova Crysta" },
  { name: "Vikram Singh", text: "Affordable prices and reliable service. The Creta was in mint condition for our family outing. Will book again for sure.", car: "Hyundai Creta" },
];

export default function Home() {
  const featured = CARS.slice(0, 6);
  const signatureCar = getCarBySlug("toyota-fortuner") || CARS[0];

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-radial-gold blur-3xl" />

        <div className="container-x relative grid min-h-screen items-center gap-8 pt-28 lg:grid-cols-2 lg:pt-0">
          {/* Left copy */}
          <div className="animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-xs font-medium text-gold-light">
              <MapPin size={13} /> {SITE.city}&apos;s Trusted Car Rental · {SITE.tagline}
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.05] sm:text-6xl xl:text-7xl">
              Your Ride,
              <br />
              <span className="gold-text">Your Way</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground/60">
              All types of cars on rent in {SITE.city} at affordable prices — from
              budget hatchbacks to luxury cars for weddings. Self-drive or
              chauffeur-driven, delivered to your door.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/cars" className="btn-gold">
                Explore Fleet <ArrowRight size={17} />
              </Link>
              <a
                href={waLink("Hi ViRaj Rides! I want to rent a car. Please share details.")}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-8">
              {STATS.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl font-bold gold-text">{s.value}</p>
                  <p className="text-xs uppercase tracking-wider text-foreground/40">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — cinematic real-car hero */}
          <div className="relative h-[45vh] min-h-[360px] w-full lg:h-[80vh]">
            <HeroVisual />
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center text-xs text-foreground/30">
              ✦ Move your cursor · scroll down to explore the showroom
            </p>
          </div>
        </div>
      </section>

      {/* ================= STATS BAR ================= */}
      <section className="border-y border-ink-line bg-ink-soft">
        <div className="container-x grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-4xl font-bold gold-text">{s.value}</p>
              <p className="mt-1 text-sm text-foreground/50">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= SCROLL-DRIVEN SHOWROOM ================= */}
      {signatureCar && <ScrollShowroom car={signatureCar} />}

      {/* ================= FEATURED FLEET ================= */}
      <section id="fleet" className="py-24">
        <div className="container-x">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <p className="section-label">The Collection</p>
            <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              A Fleet Worthy of <span className="gold-text">Royalty</span>
            </h2>
            <p className="mt-4 text-foreground/50">
              Hand-picked marques from the world&apos;s most prestigious manufacturers,
              maintained to showroom perfection.
            </p>
          </Reveal>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <Link href="/cars" className="btn-outline">
              View All 10 Cars <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ================= EXPERIENCE ================= */}
      <section id="experience" className="relative overflow-hidden border-y border-ink-line bg-ink-soft py-24">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-radial-gold blur-3xl" />
        <div className="container-x">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <p className="section-label">How It Works</p>
            <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              Booking in <span className="gold-text">Three Steps</span>
            </h2>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.12}>
                <div className="card-luxury h-full p-8 text-center hover:border-gold/40">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/5">
                    <step.icon className="text-gold" size={26} />
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
      <section className="py-24">
        <div className="container-x">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <p className="section-label">Testimonials</p>
            <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              Loved by <span className="gold-text">Jaipur&apos;s Finest</span>
            </h2>
          </Reveal>

          <div className="grid gap-7 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.1}>
                <div className="card-luxury h-full p-8">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} size={16} className="fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/70">&ldquo;{r.text}&rdquo;</p>
                  <div className="mt-6 border-t border-ink-line pt-4">
                    <p className="font-semibold text-foreground">{r.name}</p>
                    <p className="text-xs text-gold">{r.car}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="pb-24">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-ink-card to-ink-soft p-12 text-center md:p-20">
              <div className="pointer-events-none absolute inset-0 bg-radial-gold" />
              <div className="relative">
                <h2 className="font-display text-4xl font-bold sm:text-5xl">
                  Ready to Turn Heads?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-foreground/60">
                  Your dream car is one tap away. Book now and experience luxury delivered
                  to your doorstep anywhere in Jaipur.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link href="/cars" className="btn-gold">
                    Book Your Car <ArrowRight size={17} />
                  </Link>
                  <a href={`tel:${SITE.phonePrimary}`} className="btn-outline">
                    Call {SITE.phonePrimaryDisplay}
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
