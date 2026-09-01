/** Find a clean Audi R8 photo on Wikimedia Commons for the hero. */
const API = "https://commons.wikimedia.org/w/api.php";

async function search(term) {
  const url =
    `${API}?action=query&format=json&generator=search` +
    `&gsrsearch=${encodeURIComponent(`filetype:bitmap ${term}`)}` +
    `&gsrnamespace=6&gsrlimit=12` +
    `&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1600`;
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
    .filter((c) => c.w >= 1400 && c.w > c.h)
    .filter((c) => !/interior|engine|dashboard|logo|badge|emblem|lamp|wheel|detail/i.test(c.title));
}

for (const term of ["Audi R8 V10", "Audi R8 coupe", "Audi R8 2020"]) {
  try {
    const r = await search(term);
    console.log(`\n### ${term}`);
    r.slice(0, 8).forEach((c, i) =>
      console.log(`  [${i}] ${c.title}\n      ${c.w}x${c.h} | ${c.license} | ${c.artist.slice(0, 40)}`)
    );
    if (!r.length) console.log("  (none)");
  } catch (e) {
    console.log(`\n### ${term} — ERROR ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 3500));
}
