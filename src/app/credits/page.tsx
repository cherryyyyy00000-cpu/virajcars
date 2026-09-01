import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CARS } from "@/lib/cars";

export const metadata = {
  title: "Photo Credits",
  description: "Attribution for the car photographs used on this site.",
};

export default function CreditsPage() {
  return (
    <div className="container-x pb-24 pt-32">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-brand-light"
      >
        <ArrowLeft size={16} /> Back home
      </Link>

      <h1 className="mt-6 font-display text-4xl font-bold">
        Photo <span className="brand-text">Credits</span>
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/55">
        The car photographs below are representative images of each model, sourced from
        Wikimedia Commons and used under their respective licences. We&apos;re happy to
        replace any of them with photos of our own vehicles.
      </p>

      <ul className="mt-10 space-y-3">
        {CARS.map((car) => (
          <li
            key={car.slug}
            className="card-luxury flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold">
                {car.brand} {car.name}
              </p>
              <p className="text-xs text-foreground/45">
                Photo by {car.photoCredit.author} · {car.photoCredit.license}
              </p>
            </div>
            <a
              href={car.photoCredit.source}
              target="_blank"
              rel="noreferrer noopener"
              className="text-xs text-brand hover:underline"
            >
              View source →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
