import sharp from "sharp";
import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "public", "icons");
fs.mkdirSync(outDir, { recursive: true });

function svg(size) {
  const fs = size;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#E7C877"/>
      <stop offset="0.5" stop-color="#C9A24B"/>
      <stop offset="1" stop-color="#8C6D2E"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="#0a0a0b"/>
  <rect x="24" y="24" width="464" height="464" rx="92" fill="none" stroke="url(#g)" stroke-width="6" opacity="0.5"/>
  <!-- Car silhouette -->
  <g transform="translate(0,26)">
    <path d="M96 300 q10 -70 70 -78 l40 -46 q16 -18 44 -18 h72 q30 0 46 22 l34 46 q54 6 64 74 l4 30 q2 20 -18 20 h-40 a34 34 0 1 0 -68 0 h-96 a34 34 0 1 0 -68 0 h-38 q-20 0 -18 -20 z"
      fill="url(#g)"/>
    <circle cx="188" cy="332" r="24" fill="#0a0a0b"/>
    <circle cx="188" cy="332" r="10" fill="url(#g)"/>
    <circle cx="352" cy="332" r="24" fill="#0a0a0b"/>
    <circle cx="352" cy="332" r="10" fill="url(#g)"/>
    <path d="M226 176 q10 -12 30 -12 h60 q18 0 28 14 l22 30 h-170 z" fill="#0b0f14" opacity="0.85"/>
  </g>
  <text x="256" y="452" font-family="Georgia, serif" font-size="50" font-weight="bold" fill="url(#g)" text-anchor="middle">ViRaj Rides</text>
</svg>`;
}

const sizes = [192, 512];
for (const s of sizes) {
  await sharp(Buffer.from(svg(s)))
    .resize(s, s)
    .png()
    .toFile(path.join(outDir, `icon-${s}.png`));
  console.log(`generated icon-${s}.png`);
}

// Maskable (extra padding) — reuse 512 art
await sharp(Buffer.from(svg(512)))
  .resize(512, 512)
  .png()
  .toFile(path.join(outDir, `icon-maskable-512.png`));
console.log("generated icon-maskable-512.png");

// Apple touch icon
await sharp(Buffer.from(svg(180))).resize(180, 180).png().toFile(path.join(outDir, `apple-touch-icon.png`));
console.log("done");
