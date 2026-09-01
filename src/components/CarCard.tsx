"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, Gauge, Fuel, Star, ArrowUpRight } from "lucide-react";
import { Car } from "@/lib/cars";
import { formatINR } from "@/lib/utils";

export default function CarCard({ car, index = 0 }: { car: Car; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="card-luxury group overflow-hidden hover:border-gold/40 hover:shadow-gold-lg"
    >
      {/* Real photo showroom stage */}
      <div
        className="relative flex h-52 items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 120%, ${car.bodyColor}55 0%, #0a0a0b 70%)`,
        }}
      >
        <div className="absolute inset-x-0 top-4 z-10 flex justify-between px-5">
          <span className="rounded-full border border-gold/30 bg-ink/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold backdrop-blur">
            {car.category}
          </span>
          <span className="flex items-center gap-1 rounded-full border border-white/10 bg-ink/60 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur">
            <Star size={12} className="fill-gold text-gold" /> {car.rating}
          </span>
        </div>

        <Image
          src={car.image}
          alt={`${car.brand} ${car.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-card via-transparent to-transparent" />
      </div>

      <div className="p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-gold">{car.brand}</p>
        <h3 className="mt-1 font-display text-2xl font-bold text-foreground">{car.name}</h3>
        <p className="mt-1 text-sm text-foreground/50">{car.tagline}</p>

        <div className="mt-5 grid grid-cols-3 gap-2 border-y border-ink-line py-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <Users size={16} className="text-gold" />
            <span className="text-xs text-foreground/60">{car.seats} Seats</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Gauge size={16} className="text-gold" />
            <span className="text-xs text-foreground/60">{car.topSpeed} km/h</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Fuel size={16} className="text-gold" />
            <span className="text-xs text-foreground/60">{car.fuel}</span>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-xs text-foreground/40">Starting at</p>
            <p className="font-display text-2xl font-bold gold-text">
              {formatINR(car.pricePerDay)}
              <span className="text-sm font-normal text-foreground/40"> /day</span>
            </p>
          </div>
          <Link
            href={`/cars/${car.slug}`}
            className="flex items-center gap-1 rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-105"
          >
            Book <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
