/**
 * Brands the 3D showroom car with a ViRaj Rides Jaipur number plate.
 *
 * The Khronos CarConcept sample ships with a placeholder license plate.
 * We replace that texture with an authentic Indian plate (RJ-14 = Jaipur RTO)
 * so the hero car feels like it belongs to ViRaj Rides.
 *
 * Usage: node scripts/brand-model.mjs
 */
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import sharp from "sharp";

const MODEL = "public/models/showroom-car.glb";
const PLATE_TEXT = "RJ 14 VR 0001";

function plateSvg(w = 512, h = 128) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="#f7f7f2"/>
    <rect x="6" y="6" width="${w - 12}" height="${h - 12}" fill="none" stroke="#111" stroke-width="5" rx="10"/>
    <text x="${w / 2}" y="${h / 2 + 22}"
      font-family="DejaVu Sans, Arial, Helvetica, sans-serif"
      font-size="58" font-weight="bold" fill="#111"
      text-anchor="middle" letter-spacing="4">${PLATE_TEXT}</text>
  </svg>`;
}

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "draco3d.decoder": await draco3d.createDecoderModule(),
  "draco3d.encoder": await draco3d.createEncoderModule(),
});

const doc = await io.read(MODEL);
const material = doc.getRoot().listMaterials().find((m) => m.getName() === "License");

if (!material) {
  console.log("⚠ No 'License' material found — skipping plate branding.");
  process.exit(0);
}

const texture = material.getBaseColorTexture();
if (!texture) {
  console.log("⚠ License material has no base colour texture — skipping.");
  process.exit(0);
}

const [w, h] = texture.getSize() ?? [512, 128];
const webp = await sharp(Buffer.from(plateSvg(w, h))).webp({ quality: 92 }).toBuffer();

texture.setImage(webp).setMimeType("image/webp");

await io.write(MODEL, doc);
console.log(`✓ License plate branded "${PLATE_TEXT}" (${w}x${h}, ${webp.length} bytes)`);
