"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CarCard from "@/components/CarCard";
import { CARS, CATEGORIES } from "@/lib/cars";
import { cn } from "@/lib/utils";

export default function FleetPage() {
  const [active, setActive] = useState<string>("All");

  const filtered =
    active === "All" ? CARS : CARS.filter((c) => c.category === active);

  return (
    <div className="pt-32">
      {/* Header */}
      <section className="container-x text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-label"
        >
          The Full Collection
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-3 font-display text-5xl font-bold sm:text-6xl"
        >
          Our <span className="gold-text">Luxury Fleet</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-4 max-w-xl text-foreground/50"
        >
          Ten hand-picked masterpieces, ready to be driven. Filter by category and
          reserve your experience in seconds.
        </motion.p>
      </section>

      {/* Filter pills */}
      <section className="container-x mt-10 flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300",
              active === cat
                ? "border-gold bg-gold-gradient text-ink"
                : "border-ink-line text-foreground/60 hover:border-gold/40 hover:text-gold-light"
            )}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Grid */}
      <section className="container-x mt-12 pb-24">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
