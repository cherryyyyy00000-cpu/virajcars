/**
 * Downloads accurate, properly-licensed photos of each car in the ViRaj Rides
 * fleet from Wikimedia Commons, optimises them to WebP, and stores them
 * locally in /public/cars.
 *
 * Serving images from our own domain (instead of hotlinking) makes the site
 * noticeably faster and guarantees each card shows the car it names.
 *
 * Usage: node scripts/fetch-car-photos.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public", "cars");
fs.mkdirSync(OUT, { recursive: true });

const UA = "VirajRides/1.0 (car rental site build; virajrides@gmail.com)";

// Chosen photos — each verified to actually depict the named model.
const PHOTOS = [
  {
    slug: "maruti-swift",
    file: "Maruti_Suzuki_Swift_2092.JPG",
    hash: "d/d2",
    credit: "Premnath Kudva",
    license: "CC BY-SA 3.0",
  },
  {
    slug: "maruti-dzire",
    file: "Maruti_Suzuki_Dzire_VXi_VVT.JPG",
    hash: "1/1c",
    credit: "Biswarup Ganguly",
    license: "CC BY 3.0",
  },
  {
    slug: "hyundai-creta",
    file: "HYUNDAI_CRETA_%2C_iX25_%28SU2%29_China_%281%29.jpg",
    hash: "b/be",
    credit: "Dinkun Chen",
    license: "CC BY-SA 4.0",
  },
  {
    slug: "maruti-ertiga",
    file: "Maruti_Suzuki_Ertiga%282%29.jpg",
    hash: "4/45",
    credit: "Akashpbrahmavar",
    license: "CC0",
  },
  {
    slug: "toyota-innova-crysta",
    file: "Toyota_Innova_Crysta_2.4_Z_front_right.jpg",
    hash: "8/87",
    credit: "Premnath Kudva",
    license: "CC BY-SA 4.0",
  },
  {
    slug: "mahindra-thar",
    file: "Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_01.jpg",
    hash: "9/91",
    credit: "Ank Kumar",
    license: "CC BY-SA 4.0",
  },
  {
    slug: "mahindra-scorpio",
    file: "Mahindra_Scorpio_2014.JPG",
    hash: "e/e8",
    credit: "Ask27",
    license: "CC BY-SA 4.0",
  },
  {
    slug: "hyundai-verna",
    file: "HYUNDAI_VERNA_%28HYUNDAI_ACCENT%29_%28RB%2CRC%29_China.jpg",
    hash: "3/31",
    credit: "Dinkun Chen",
    license: "CC BY-SA 4.0",
  },
  {
    slug: "toyota-fortuner",
    file: "Toyota_Fortuner%2C_Cape_Town_%28P1060077%29.jpg",
    hash: "3/37",
    credit: "Matti Blume",
    license: "CC BY-SA 4.0",
  },
  {
    slug: "mercedes-e-class",
    file: "2018_Mercedes-Benz_E_300_%28W_213%29_sedan_%282018-11-02%29_01.jpg",
    hash: "a/ae",
    credit: "EurovisionNim",
    license: "CC BY-SA 4.0",
  },
];

const credits = [];

for (const p of PHOTOS) {
  // Special:FilePath is the documented, stable way to fetch a scaled Commons file.
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${p.file}?width=1600`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) {
      console.log(`✗ ${p.slug}: HTTP ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());

    // Wide card/hero crop, optimised
    await sharp(buf)
      .resize(1400, 875, { fit: "cover", position: "centre" })
      .webp({ quality: 82 })
      .toFile(path.join(OUT, `${p.slug}.webp`));

    const stat = fs.statSync(path.join(OUT, `${p.slug}.webp`));
    console.log(`✓ ${p.slug}.webp  ${(stat.size / 1024).toFixed(0)} KB  (${p.license}, ${p.credit})`);

    credits.push({
      slug: p.slug,
      credit: p.credit,
      license: p.license,
      source: `https://commons.wikimedia.org/wiki/File:${p.file}`,
    });
  } catch (e) {
    console.log(`✗ ${p.slug}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 600));
}

fs.writeFileSync(
  path.join(process.cwd(), "src", "lib", "photo-credits.json"),
  JSON.stringify(credits, null, 2)
);
console.log(`\nWrote ${credits.length} credits to src/lib/photo-credits.json`);
