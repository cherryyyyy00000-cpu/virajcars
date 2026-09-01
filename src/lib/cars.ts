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
  /** Accent colour used for lighting/glow in the 3D showroom bay. */
  bodyColor: string;
  accent: string;
  /**
   * Locally-hosted photo of this exact model (served from /public/cars).
   * To show ViRaj Rides' OWN car, just drop a photo at the same path.
   */
  image: string;
  /** Photo attribution (Wikimedia Commons). */
  photoCredit: { author: string; license: string; source: string };
  description: string;
  features: string[];
  available: boolean;
};

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
    bodyColor: "#9aa3ab",
    accent: "#E8A860",
    image: "/cars/maruti-swift.webp",
    photoCredit: {
      author: "Premnath Kudva",
      license: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Maruti_Suzuki_Swift_2092.JPG",
    },
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
    bodyColor: "#c9c3b6",
    accent: "#C87137",
    image: "/cars/maruti-dzire.webp",
    photoCredit: {
      author: "Biswarup Ganguly",
      license: "CC BY 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Maruti_Suzuki_Dzire_VXi_VVT.JPG",
    },
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
    bodyColor: "#4a4f57",
    accent: "#8ab4f8",
    image: "/cars/hyundai-creta.webp",
    photoCredit: {
      author: "Dairokkan9",
      license: "CC BY-SA 4.0",
      source:
        "https://commons.wikimedia.org/wiki/File:2021_Hyundai_Creta_SX(O)_CRDi_(India)_front_view.jpg",
    },
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
    bodyColor: "#e8e6e1",
    accent: "#C87137",
    image: "/cars/maruti-ertiga.webp",
    photoCredit: {
      author: "Ramakrishna Mission Vidyapith",
      license: "Public domain",
      source: "https://commons.wikimedia.org/wiki/File:2022_Maruti_Suzuki_Ertiga_LXi.jpg",
    },
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
    bodyColor: "#f2f2f0",
    accent: "#C87137",
    image: "/cars/toyota-innova-crysta.webp",
    photoCredit: {
      author: "Premnath Kudva",
      license: "CC BY-SA 4.0",
      source:
        "https://commons.wikimedia.org/wiki/File:Toyota_Innova_Crysta_2.4_Z_front_right.jpg",
    },
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
    bodyColor: "#b8232f",
    accent: "#E8A860",
    image: "/cars/mahindra-thar.webp",
    photoCredit: {
      author: "Ank Kumar",
      license: "CC BY-SA 4.0",
      source:
        'https://commons.wikimedia.org/wiki/File:Mahindra_Thar_SUV_in_"Red_Rage"_color_at_Ashiana_Brahmanda,_East_Singbhum_India_(Ank_Kumar,_Infosys_limited)_01.jpg',
    },
    description:
      "Turn every drive into an adventure. The iconic Mahindra Thar is a head-turner built for fun — perfect for photoshoots, road trips and off-road escapes.",
    features: ["4x4 capable", "Hard top", "Iconic design", "Touchscreen", "Rugged & fun"],
    available: true,
  },
  {
    id: "7",
    slug: "mahindra-scorpio",
    name: "Scorpio",
    brand: "Mahindra",
    tagline: "Bold, powerful & commanding",
    category: "SUV",
    pricePerDay: 4200,
    pricePerHour: 580,
    seats: 7,
    transmission: "Manual",
    fuel: "Diesel",
    topSpeed: 160,
    mileage: 15,
    rating: 4.7,
    reviews: 71,
    bodyColor: "#eceff1",
    accent: "#C87137",
    image: "/cars/mahindra-scorpio.webp",
    photoCredit: {
      author: "Ask27",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Mahindra_Scorpio_2014.JPG",
    },
    description:
      "Muscular road presence with 7-seat practicality. The Scorpio combines power, space and comfort — a favourite for big families and highway cruising.",
    features: ["7 seats", "High ground clearance", "Powerful diesel", "Music system", "Tough build"],
    available: true,
  },
  {
    id: "8",
    slug: "hyundai-verna",
    name: "Verna",
    brand: "Hyundai",
    tagline: "Smooth, refined premium sedan",
    category: "Sedan",
    pricePerDay: 3000,
    pricePerHour: 420,
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    topSpeed: 180,
    mileage: 18,
    rating: 4.7,
    reviews: 58,
    bodyColor: "#f4f4f2",
    accent: "#8ab4f8",
    image: "/cars/hyundai-verna.webp",
    photoCredit: {
      author: "Dinkun Chen",
      license: "CC BY-SA 4.0",
      source:
        "https://commons.wikimedia.org/wiki/File:HYUNDAI_VERNA_(HYUNDAI_ACCENT)_(RB,RC)_China_(2).jpg",
    },
    description:
      "Comfortable, refined and easy on fuel. The Hyundai Verna is a solid premium sedan choice for business travel, airport runs and city comfort.",
    features: ["Spacious cabin", "Smooth ride", "AC with rear vents", "Music system", "Good boot"],
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
    bodyColor: "#8a8378",
    accent: "#E8A860",
    image: "/cars/toyota-fortuner.webp",
    photoCredit: {
      author: "Matti Blume",
      license: "CC BY-SA 4.0",
      source:
        "https://commons.wikimedia.org/wiki/File:Toyota_Fortuner,_Cape_Town_(P1060077).jpg",
    },
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
    bodyColor: "#ffffff",
    accent: "#E8A860",
    image: "/cars/mercedes-e-class.webp",
    photoCredit: {
      author: "EurovisionNim",
      license: "CC BY-SA 4.0",
      source:
        "https://commons.wikimedia.org/wiki/File:2018_Mercedes-Benz_E_300_(W_213)_sedan_(2018-11-02)_01.jpg",
    },
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
