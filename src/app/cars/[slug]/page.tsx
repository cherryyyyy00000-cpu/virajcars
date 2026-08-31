import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Users,
  Gauge,
  Fuel,
  Zap,
  Cog,
  Star,
  Check,
} from "lucide-react";
import { CARS, getCarBySlug } from "@/lib/cars";
import { formatINR } from "@/lib/utils";
import CarStageLoader from "@/components/three/CarStageLoader";
import BookingForm from "@/components/BookingForm";

export function generateStaticParams() {
  return CARS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const car = getCarBySlug(params.slug);
  if (!car) return { title: "Car not found" };
  return {
    title: `Rent ${car.brand} ${car.name} in Jaipur`,
    description: car.description,
  };
}

export default function CarDetailPage({ params }: { params: { slug: string } }) {
  const car = getCarBySlug(params.slug);
  if (!car) notFound();

  const specs = [
    { icon: Users, label: "Seats", value: `${car.seats}` },
    { icon: Cog, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel", value: car.fuel },
    { icon: Gauge, label: "Top Speed", value: `${car.topSpeed} km/h` },
    { icon: Zap, label: "Mileage", value: `${car.mileage} km/l` },
    { icon: Star, label: "Rating", value: `${car.rating} (${car.reviews})` },
  ];

  return (
    <div className="pt-28">
      <div className="container-x">
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 text-sm text-foreground/50 transition-colors hover:text-gold-light"
        >
          <ArrowLeft size={16} /> Back to Fleet
        </Link>
      </div>

      {/* 3D showcase */}
      <section className="container-x mt-6">
        <div
          className="relative h-[45vh] min-h-[340px] overflow-hidden rounded-3xl border border-ink-line"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${car.bodyColor}44 0%, #0a0a0b 65%)`,
          }}
        >
          <CarStageLoader bodyColor={car.bodyColor} accent={car.accent} autoRotate />
          <div className="absolute left-6 top-6">
            <span className="rounded-full border border-gold/30 bg-ink/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-gold backdrop-blur">
              {car.category}
            </span>
          </div>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-foreground/40">
            ✦ Drag to rotate the {car.name}
          </p>
        </div>
      </section>

      {/* Details + booking */}
      <section className="container-x mt-10 grid gap-10 pb-24 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: info */}
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-gold">
            {car.brand}
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">{car.name}</h1>
          <p className="mt-2 text-lg text-foreground/50">{car.tagline}</p>

          <p className="mt-6 max-w-2xl leading-relaxed text-foreground/70">
            {car.description}
          </p>

          {/* Specs */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {specs.map((s) => (
              <div key={s.label} className="card-luxury flex items-center gap-3 p-4">
                <s.icon className="text-gold" size={20} />
                <div>
                  <p className="text-xs text-foreground/40">{s.label}</p>
                  <p className="text-sm font-semibold">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="mt-8">
            <h3 className="font-display text-xl font-bold">Highlights</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {car.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-foreground/70">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/15">
                    <Check size={12} className="text-gold" />
                  </span>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold gold-text">
              {formatINR(car.pricePerDay)}
            </span>
            <span className="text-foreground/40">/ day</span>
            <span className="ml-3 text-sm text-foreground/40">
              or {formatINR(car.pricePerHour)}/hour
            </span>
          </div>
        </div>

        {/* Right: booking */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingForm car={car} />
        </div>
      </section>
    </div>
  );
}
