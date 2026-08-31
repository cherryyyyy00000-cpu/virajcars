/**
 * Central business configuration for ViRaj Rides.
 * Update contact details, name, or links here — everything else reads from this.
 */
export const SITE = {
  name: "ViRaj Rides",
  brandLead: "ViRaj", // gold part of the logo
  brandTail: "Rides", // light part of the logo
  tagline: "Miles and Smiles",
  motto: "All Types of Cars · Affordable Prices · Reliable Service · Comfortable Rides",
  city: "Jaipur",
  state: "Rajasthan",
  gstin: "08ABCFV5541Q1ZI",

  // Primary contact used for calls / WhatsApp
  phonePrimary: "+918072256426",
  phonePrimaryDisplay: "+91 80722 56426",
  whatsapp: "918072256426", // wa.me format (no +)

  contacts: [
    { name: "Vipin Choudhary", phone: "+918072256426", display: "+91 80722 56426" },
    { name: "Rajiv Sheoran", phone: "+917497017607", display: "+91 74970 17607" },
  ],

  email: "virajrides@gmail.com",
  address: "Jaipur, Rajasthan",
  instagram: "https://instagram.com",
} as const;

export function waLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}
