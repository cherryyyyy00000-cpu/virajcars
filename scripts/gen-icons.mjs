/**
 * Generates PWA app icons using the ViRaj Rides "VR" monogram from the
 * company signboard, in the brand's copper-bronze finish.
 *
 * Usage: node scripts/gen-icons.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "public", "icons");
fs.mkdirSync(outDir, { recursive: true });

/** @param {boolean} maskable adds safe-area padding for Android maskable icons */
function svg(maskable = false) {
  const s = maskable ? 0.68 : 0.82; // monogram scale inside the tile
  const shift = (512 - 512 * s) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E8A860"/>
      <stop offset="55%" stop-color="#C87137"/>
      <stop offset="100%" stop-color="#8E4A20"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="${maskable ? 0 : 108}" fill="#08080A"/>
  <g transform="translate(${shift},${shift}) scale(${s})">
    <g transform="translate(0,-18)">
      <path d="M92 102 L226 388 L288 235"
        stroke="url(#g)" stroke-width="56" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M296 388 L296 112 L368 112 C430 112 440 205 368 225 L306 235 L430 388"
        stroke="url(#g)" stroke-width="56" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </g>
    <text x="256" y="470" font-family="Georgia, 'DejaVu Serif', serif" font-size="52"
      font-weight="bold" fill="url(#g)" text-anchor="middle">ViRaj Rides</text>
  </g>
</svg>`;
}

for (const size of [192, 512]) {
  await sharp(Buffer.from(svg(false)))
    .resize(size, size)
    .png()
    .toFile(path.join(outDir, `icon-${size}.png`));
  console.log(`generated icon-${size}.png`);
}

await sharp(Buffer.from(svg(true)))
  .resize(512, 512)
  .png()
  .toFile(path.join(outDir, "icon-maskable-512.png"));
console.log("generated icon-maskable-512.png");

await sharp(Buffer.from(svg(false)))
  .resize(180, 180)
  .png()
  .toFile(path.join(outDir, "apple-touch-icon.png"));
console.log("generated apple-touch-icon.png");
