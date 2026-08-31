export type Car = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  category: "Hatchback" | "Sedan" | "SUV" | "Premium SUV" | "MPV" | "Luxury";
  pricePerDay: number;
  pricePerHour: number;
  seats: number;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Electric" | "Hybrid" | "CNG";
  topSpeed: number; // km/h
  mileage: number; // km/l (approx)
  rating: number;
  reviews: number;
  // Hex color used for the 3D procedural car body
  bodyColor: string;
  accent: string;
  description: string;
  features: string[];
  available: boolean;
};

// Realistic fleet for a Jaipur self-drive / chauffeur rental —
// "All types of cars, affordable prices". Prices are indicative per-day rates
// (self-drive). Update freely to match ViRaj Rides' actual pricing.
export const CARS: Car[] = [
  {
    id: "1",
    slug: "maruti-swift",
    name: "Swift",
    brand: "Maruti Suzuki",
    tagline: "Zippy, economical & city-friendly",
    category: "Hatchback",
    pricePerDay: 1600,
    pricePerHour: 250,
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    topSpeed: 165,
    mileage: 22,
    rating: 4.6,
    reviews: 84,
    bodyColor: "#b91c1c",
    accent: "#f5f5f5",
    description:
      "The perfect city companion. The Maruti Swift is fuel-efficient, easy to drive and ideal for zipping around Jaipur — great for couples and solo travellers.",
    features: ["Power steering", "AC", "Bluetooth music", "Great mileage", "Easy parking"],
    available: true,
  },
  {
    id: "2",
    slug: "maruti-dzire",
    name: "Dzire",
    brand: "Maruti Suzuki",
    tagline: "Comfortable compact sedan",
    category: "Sedan",
    pricePerDay: 2000,
    pricePerHour: 300,
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    topSpeed: 170,
    mileage: 23,
    rating: 4.7,
    reviews: 112,
    bodyColor: "#e5e7eb",
    accent: "#C9A24B",
    description:
      "A roomy, comfortable sedan loved for outstation trips and airport transfers. The Dzire offers a smooth ride with generous boot space for luggage.",
    features: ["Spacious boot", "AC", "Touchscreen", "Rear AC vents", "Fuel efficient"],
    available: true,
  },
  {
    id: "3",
    slug: "hyundai-creta",
    name: "Creta",
    brand: "Hyundai",
    tagline: "India's favourite compact SUV",
    category: "SUV",
    pricePerDay: 3200,
    pricePerHour: 450,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 180,
    mileage: 17,
    rating: 4.8,
    reviews: 96,
    bodyColor: "#1a1a2e",
    accent: "#8ab4f8",
    description:
      "Commanding stance, plush interiors and a smooth automatic. The Hyundai Creta is perfect for family getaways and weekend road trips around Rajasthan.",
    features: ["Sunroof", "Automatic", "Ventilated seats", "Touchscreen", "Rear camera"],
    available: true,
  },
  {
    id: "4",
    slug: "maruti-ertiga",
    name: "Ertiga",
    brand: "Maruti Suzuki",
    tagline: "7-seater comfort for the whole family",
    category: "MPV",
    pricePerDay: 2600,
    pricePerHour: 400,
    seats: 7,
    transmission: "Manual",
    fuel: "CNG",
    topSpeed: 160,
    mileage: 20,
    rating: 4.6,
    reviews: 78,
    bodyColor: "#2b2f33",
    accent: "#C9A24B",
    description:
      "Spacious, economical and family-ready. The Ertiga seats 7 comfortably and is a top pick for group trips, weddings and temple tours across Rajasthan.",
    features: ["7 seats", "CNG option", "Big boot", "Rear AC", "Comfortable ride"],
    available: true,
  },
  {
    id: "5",
    slug: "toyota-innova-crysta",
    name: "Innova Crysta",
    brand: "Toyota",
    tagline: "The gold standard for road trips",
    category: "MPV",
    pricePerDay: 4500,
    pricePerHour: 600,
    seats: 7,
    transmission: "Manual",
    fuel: "Diesel",
    topSpeed: 179,
    mileage: 14,
    rating: 4.9,
    reviews: 164,
    bodyColor: "#0f2038",
    accent: "#D8DEE9",
    description:
      "The most trusted name for long journeys. The Innova Crysta offers captain seats, a powerful diesel engine and unmatched reliability — ideal for outstation tours.",
    features: ["Captain seats", "Powerful diesel", "Premium interior", "Very reliable", "Huge boot"],
    available: true,
  },
  {
    id: "6",
    slug: "mahindra-thar",
    name: "Thar",
    brand: "Mahindra",
    tagline: "Adventure without limits",
    category: "SUV",
    pricePerDay: 3800,
    pricePerHour: 550,
    seats: 4,
    transmission: "Manual",
    fuel: "Diesel",
    topSpeed: 155,
    mileage: 15,
    rating: 4.8,
    reviews: 132,
    bodyColor: "#14342b",
    accent: "#E7C877",
    description:
      "Turn every drive into an adventure. The iconic Mahindra Thar is a head-turner built for fun — perfect for photoshoots, road trips and off-road escapes.",
    features: ["4x4 capable", "Convertible top", "Iconic design", "Touchscreen", "Rugged & fun"],
    available: true,
  },
  {
    id: "7",
    slug: "mahindra-scorpio-n",
    name: "Scorpio-N",
    brand: "Mahindra",
    tagline: "Bold, powerful & commanding",
    category: "SUV",
    pricePerDay: 4200,
    pricePerHour: 580,
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    topSpeed: 175,
    mileage: 15,
    rating: 4.7,
    reviews: 71,
    bodyColor: "#111827",
    accent: "#C9A24B",
    description:
      "Muscular road presence with 7-seat practicality. The Scorpio-N combines power, space and comfort — a favourite for big families and highway cruising.",
    features: ["7 seats", "Automatic", "Sunroof", "Powerful engine", "Premium audio"],
    available: true,
  },
  {
    id: "8",
    slug: "hyundai-verna",
    name: "Verna",
    brand: "Hyundai",
    tagline: "Sporty premium sedan",
    category: "Sedan",
    pricePerDay: 3000,
    pricePerHour: 420,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 190,
    mileage: 18,
    rating: 4.7,
    reviews: 58,
    bodyColor: "#6d28d9",
    accent: "#f5f5f5",
    description:
      "Sleek, feature-loaded and fun to drive. The Hyundai Verna is a premium sedan choice for business travel and special occasions in style.",
    features: ["Ventilated seats", "Automatic", "Sunroof", "ADAS features", "Premium cabin"],
    available: true,
  },
  {
    id: "9",
    slug: "toyota-fortuner",
    name: "Fortuner",
    brand: "Toyota",
    tagline: "The undisputed king of SUVs",
    category: "Premium SUV",
    pricePerDay: 6500,
    pricePerHour: 850,
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    topSpeed: 180,
    mileage: 12,
    rating: 4.9,
    reviews: 143,
    bodyColor: "#2b2f33",
    accent: "#C9A24B",
    description:
      "Unmatched road presence and power. The Toyota Fortuner is the ultimate statement SUV — perfect for weddings, VIP travel and premium outstation tours.",
    features: ["4x4 available", "Powerful diesel", "Premium leather", "Commanding presence", "Very reliable"],
    available: true,
  },
  {
    id: "10",
    slug: "mercedes-e-class",
    name: "E-Class",
    brand: "Mercedes-Benz",
    tagline: "Luxury for your special day",
    category: "Luxury",
    pricePerDay: 12000,
    pricePerHour: 1800,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    topSpeed: 240,
    mileage: 12,
    rating: 5.0,
    reviews: 47,
    bodyColor: "#1b1b1d",
    accent: "#C9A24B",
    description:
      "Make an entrance to remember. The Mercedes-Benz E-Class brings executive luxury and elegance — the top choice for weddings, receptions and VIP occasions in Jaipur.",
    features: ["Chauffeur option", "Plush leather", "Ambient lighting", "Premium sound", "Wedding-ready"],
    available: true,
  },
];

export function getCarBySlug(slug: string): Car | undefined {
  return CARS.find((c) => c.slug === slug);
}

export const CATEGORIES = [
  "All",
  "Hatchback",
  "Sedan",
  "SUV",
  "Premium SUV",
  "MPV",
  "Luxury",
] as const;
