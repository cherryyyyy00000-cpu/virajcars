/**
 * Downloads each car's photo from Wikimedia Commons and writes two versions:
 *
 *   public/cars/<slug>.webp          — cropped 16:10 card photo
 *   public/cars/original/<slug>.jpg  — full uncropped frame, used for cut-outs
 *
 * The uncropped copy matters: cropping first was clipping the bottom of the
 * tyres, which then looked like a bad cut-out.
 *
 * Usage: node scripts/fetch-car-photos.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const PHOTOS = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "scripts", "car-photos.json"), "utf-8")
);

const OUT = path.join(process.cwd(), "public", "cars");
const ORIG = path.join(OUT, "original");
fs.mkdirSync(ORIG, { recursive: true });

const UA = "VirajRides/1.0 (car rental site build; virajrides@gmail.com)";

for (const p of PHOTOS) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${p.file}?width=2000`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) {
      console.log(`✗ ${p.slug}: HTTP ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());

    // Full frame for cut-outs — nothing clipped
    await sharp(buf).jpeg({ quality: 92 }).toFile(path.join(ORIG, `${p.slug}.jpg`));

    // Cropped card photo
    await sharp(buf)
      .resize(1400, 875, { fit: "cover", position: "centre" })
      .webp({ quality: 82 })
      .toFile(path.join(OUT, `${p.slug}.webp`));

    const kb = fs.statSync(path.join(OUT, `${p.slug}.webp`)).size / 1024;
    console.log(`✓ ${p.slug}  card ${kb.toFixed(0)} KB  (${p.license}, ${p.credit})`);
  } catch (e) {
    console.log(`✗ ${p.slug}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 700));
}
