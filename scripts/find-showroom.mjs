/** Find real car-showroom photography (exterior + interior) on Wikimedia Commons. */
const API = "https://commons.wikimedia.org/w/api.php";

async function search(term) {
  const url =
    `${API}?action=query&format=json&generator=search` +
    `&gsrsearch=${encodeURIComponent(`filetype:bitmap ${term}`)}` +
    `&gsrnamespace=6&gsrlimit=12` +
    `&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=2000`;
  const res = await fetch(url, {
    headers: { "User-Agent": "VirajRides/1.0 (site build; virajrides@gmail.com)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const pages = (await res.json())?.query?.pages;
  if (!pages) return [];
  return Object.values(pages)
    .map((p) => {
      const i = p.imageinfo?.[0];
      if (!i) return null;
      const m = i.extmetadata || {};
      return {
        title: p.title,
        w: i.width,
        h: i.height,
        license: m.LicenseShortName?.value || "?",
        artist: (m.Artist?.value || "").replace(/<[^>]*>/g, "").trim(),
      };
    })
    .filter(Boolean)
    .filter((c) => c.w >= 1600 && c.w > c.h * 1.15); // wide, hero-friendly
}

const TERMS = [
  "car dealership building exterior night",
  "automobile showroom interior",
  "car dealership showroom",
  "Audi Terminal dealership",
  "Mercedes-Benz dealership building",
  "car showroom glass facade",
];

for (const t of TERMS) {
  try {
    const r = await search(t);
    console.log(`\n### ${t}`);
    r.slice(0, 8).forEach((c, i) =>
      console.log(`  [${i}] ${c.title}\n      ${c.w}x${c.h} | ${c.license} | ${c.artist.slice(0, 38)}`)
    );
    if (!r.length) console.log("  (none)");
  } catch (e) {
    console.log(`\n### ${t} — ERROR ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 3200));
}
