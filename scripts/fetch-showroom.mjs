/**
 * Downloads the real showroom photography used by the arrival hero.
 *
 * Hand-drawing a building in CSS looked cheap; real architectural photography
 * of a lit glass showroom at night looks like the real thing AND is faster to
 * render than dozens of gradient layers.
 *
 * Outputs (WebP, sized for a full-bleed hero):
 *   public/showroom/arrival.webp  — 3/4 view, driveway visible (far shot)
 *   public/showroom/facade.webp   — front-on facade, cars on every floor (near shot)
 *
 * Usage: node scripts/fetch-showroom.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public", "showroom");
fs.mkdirSync(OUT, { recursive: true });

const UA = "VirajRides/1.0 (car rental site build; virajrides@gmail.com)";

const SHOTS = [
  {
    name: "arrival",
    file: "Concesionario_de_Mercedes-Benz%2C_M%C3%BAnich%2C_Alemania%2C_2013-03-30%2C_DD_27.JPG",
    credit: "Diego Delso",
    license: "CC BY-SA 3.0",
    width: 1920,
    height: 1200,
  },
  {
    name: "facade",
    file: "Concesionario_de_Mercedes-Benz%2C_M%C3%BAnich%2C_Alemania%2C_2013-03-30%2C_DD_25.JPG",
    credit: "Diego Delso",
    license: "CC BY-SA 3.0",
    width: 1920,
    height: 1080,
  },
];

for (const s of SHOTS) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${s.file}?width=2400`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) {
      console.log(`✗ ${s.name}: HTTP ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const dest = path.join(OUT, `${s.name}.webp`);

    await sharp(buf)
      .resize(s.width, s.height, { fit: "cover", position: "centre" })
      // Deepen the night and cool it slightly so our copper UI pops on top
      .modulate({ brightness: 0.86, saturation: 0.92 })
      .webp({ quality: 78 })
      .toFile(dest);

    console.log(
      `✓ ${s.name}.webp  ${(fs.statSync(dest).size / 1024).toFixed(0)} KB  (${s.license}, ${s.credit})`
    );
  } catch (e) {
    console.log(`✗ ${s.name}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 700));
}
