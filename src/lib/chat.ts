import { CARS } from "./cars";
import { SITE } from "./site";
import { formatINR } from "./utils";

/** Business knowledge base used both for the AI system prompt and the offline fallback. */
export const FAQ = {
  documents:
    "For self-drive you'll need: a valid Driving License, Aadhaar/ID proof, and a refundable security deposit. For chauffeur-driven bookings, no documents are needed from you.",
  timings:
    "We're available 24/7 for bookings. Cars can be picked up or delivered any time by prior arrangement.",
  delivery:
    "Yes! We offer free doorstep delivery and pickup across Jaipur. Outstation delivery can be arranged on request.",
  fuel:
    "Self-drive cars are given with a certain fuel level and should be returned at the same level. Chauffeur packages can include fuel — just ask.",
  cancellation:
    "Free cancellation up to 24 hours before your pickup time. After that, a small fee may apply.",
  outstation:
    "Absolutely — our cars are available for outstation trips (Udaipur, Jodhpur, Ranthambore, Delhi, etc.). Extra charges apply per km beyond the daily limit.",
  payment:
    "You can pay securely online (UPI/Card/Netbanking via Razorpay) or choose Cash on Delivery (COD). A refundable deposit applies for self-drive.",
  chauffeur:
    "Chauffeur service is available on most cars for an additional charge (approx ₹2,500/day). Select 'Chauffeur' on the booking page.",
};

export function buildSystemPrompt() {
  const fleet = CARS.map(
    (c) =>
      `- ${c.brand} ${c.name} (${c.category}, ${c.seats} seats, ${c.fuel}, ${c.transmission}): ${formatINR(
        c.pricePerDay
      )}/day`
  ).join("\n");

  return `You are "Viraj Assistant", the friendly AI helper for ${SITE.name}, a car rental business in ${SITE.city}, Rajasthan. Motto: "${SITE.tagline}".

Answer customer questions helpfully and concisely (2-4 sentences). Be warm and professional. You can reply in the same language the user uses (English, Hindi, or Hinglish).

CURRENT FLEET & PRICING (per day, self-drive):
${fleet}

KEY INFO:
- Doorstep delivery & pickup across Jaipur (free).
- Payment: Online (Razorpay) or Cash on Delivery. Refundable deposit for self-drive.
- Self-drive documents: Driving License + ID proof + deposit.
- Chauffeur available (~₹2,500/day extra).
- Available 24/7. Free cancellation up to 24h before pickup.
- Outstation trips allowed (extra per-km charges).
- Contact: ${SITE.contacts.map((c) => `${c.name} ${c.display}`).join(", ")}. GSTIN ${SITE.gstin}.

RULES:
- To book, guide users to browse the fleet and use the "Book Now" button, or contact us on WhatsApp.
- Never invent cars or prices not in the fleet above. If unsure, suggest contacting us on WhatsApp.
- Keep answers short and actionable.`;
}

/** Offline rule-based responder (used when no OPENAI_API_KEY is configured). */
export function localAnswer(message: string): string {
  const q = message.toLowerCase();

  const cheapest = [...CARS].sort((a, b) => a.pricePerDay - b.pricePerDay)[0];
  const priciest = [...CARS].sort((a, b) => b.pricePerDay - a.pricePerDay)[0];

  // Direct car name match
  const matched = CARS.find(
    (c) =>
      q.includes(c.name.toLowerCase()) ||
      q.includes(c.brand.toLowerCase()) ||
      q.includes(c.slug.replace(/-/g, " "))
  );
  if (matched) {
    return `The ${matched.brand} ${matched.name} (${matched.category}) seats ${matched.seats} and rents at ${formatINR(
      matched.pricePerDay
    )}/day (self-drive). ${matched.description} Tap "Book Now" on its page to reserve it!`;
  }

  if (/(hi|hello|hey|namaste|namaskar)\b/.test(q))
    return `Namaste! 🙏 Welcome to ${SITE.name}. I can help you find the perfect car, share prices, or explain booking. What are you looking for?`;

  if (q.includes("price") || q.includes("cost") || q.includes("rate") || q.includes("kitna") || q.includes("charge"))
    return `Our cars start from just ${formatINR(cheapest.pricePerDay)}/day (${cheapest.brand} ${cheapest.name}) up to ${formatINR(
      priciest.pricePerDay
    )}/day for the ${priciest.brand} ${priciest.name}. Browse the Fleet page for full pricing. Want a recommendation?`;

  if (q.includes("cheap") || q.includes("budget") || q.includes("sasti") || q.includes("affordable") || q.includes("low"))
    return `Our most affordable option is the ${cheapest.brand} ${cheapest.name} at ${formatINR(
      cheapest.pricePerDay
    )}/day — great mileage and easy to drive around Jaipur. Shall I help you book it?`;

  if (q.includes("wedding") || q.includes("shaadi") || q.includes("marriage") || q.includes("luxury"))
    return `For weddings we recommend the Mercedes-Benz E-Class or Toyota Fortuner — elegant and chauffeur-ready. Contact us on WhatsApp for a special wedding package!`;

  if (q.includes("7 seat") || q.includes("seven") || q.includes("family") || q.includes("group"))
    return `For families/groups, our 7-seaters are perfect: Maruti Ertiga (${formatINR(
      2600
    )}/day), Toyota Innova Crysta, and Scorpio-N. The Innova Crysta is the most comfortable for long trips.`;

  if (q.includes("document") || q.includes("licence") || q.includes("license") || q.includes("id") || q.includes("kagaz"))
    return FAQ.documents;

  if (q.includes("deliver") || q.includes("pickup") || q.includes("pick up") || q.includes("doorstep") || q.includes("ghar"))
    return FAQ.delivery;

  if (q.includes("cancel") || q.includes("refund"))
    return FAQ.cancellation;

  if (q.includes("outstation") || q.includes("trip") || q.includes("udaipur") || q.includes("jodhpur") || q.includes("bahar"))
    return FAQ.outstation;

  if (q.includes("pay") || q.includes("cod") || q.includes("cash") || q.includes("online") || q.includes("upi") || q.includes("deposit"))
    return FAQ.payment;

  if (q.includes("chauffeur") || q.includes("driver") || q.includes("with driver"))
    return FAQ.chauffeur;

  if (q.includes("time") || q.includes("open") || q.includes("hours") || q.includes("24"))
    return FAQ.timings;

  if (q.includes("contact") || q.includes("number") || q.includes("phone") || q.includes("call") || q.includes("whatsapp"))
    return `You can reach us anytime: ${SITE.contacts
      .map((c) => `${c.name} at ${c.display}`)
      .join(" or ")}. Or tap the WhatsApp button to chat instantly!`;

  if (q.includes("book") || q.includes("reserve") || q.includes("kaise"))
    return `Booking is easy: 1) Browse our Fleet, 2) Pick your car & dates, 3) Pay online or choose COD. You'll get instant confirmation. Want me to suggest a car first?`;

  // Default
  return `I can help with car options, pricing, delivery, documents, and booking for ${SITE.name}. Try asking "cheapest car", "7 seater for family", or "how to book". You can also WhatsApp us for a quick reply!`;
}
