"""
Cuts every car out of its background so it can float on a showroom pedestal
with a real mirrored reflection underneath — the way a car actually looks
standing under showroom lights.

Also cleans the white halo left along the edges and saves lightweight WebP
(with alpha) so the showroom stays fast.

Outputs: public/cars/cutout/<slug>.webp

Usage: python3 scripts/cutout-cars.py
"""

import io
import os
import glob
from rembg import remove, new_session
from PIL import Image, ImageFilter

SRC = "public/cars"
OUT = "public/cars/cutout"
os.makedirs(OUT, exist_ok=True)

session = new_session("u2net")


def clean_edges(img: Image.Image) -> Image.Image:
    """
    Erode the alpha channel by ~1px and drop barely-visible pixels.
    This removes the pale fringe rembg leaves behind, which is very obvious
    once the car sits on a dark showroom floor.
    """
    r, g, b, a = img.split()
    # Erode: MinFilter pulls the alpha edge inward
    a = a.filter(ImageFilter.MinFilter(3))
    # Harden the remaining soft edge
    a = a.point(lambda v: 0 if v < 40 else (255 if v > 205 else v))
    a = a.filter(ImageFilter.GaussianBlur(0.5))
    return Image.merge("RGBA", (r, g, b, a))


def trim(img: Image.Image, pad: int = 8) -> Image.Image:
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    w, h = img.size
    canvas = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    canvas.paste(img, (pad, pad))
    return canvas


files = sorted(glob.glob(os.path.join(SRC, "*.webp")))
print(f"Found {len(files)} source photos\n")

for path in files:
    slug = os.path.splitext(os.path.basename(path))[0]
    try:
        with open(path, "rb") as f:
            raw = f.read()

        cut = remove(
            raw,
            session=session,
            alpha_matting=True,
            alpha_matting_foreground_threshold=252,
            alpha_matting_background_threshold=12,
            alpha_matting_erode_size=10,
        )

        img = Image.open(io.BytesIO(cut)).convert("RGBA")
        img = clean_edges(img)
        img = trim(img)
        img.thumbnail((1100, 1100), Image.LANCZOS)

        dest = os.path.join(OUT, f"{slug}.webp")
        img.save(dest, "WEBP", quality=86, alpha_quality=92, method=6)

        kb = os.path.getsize(dest) / 1024
        print(f"  OK  {slug}.webp  {img.size[0]}x{img.size[1]}  {kb:.0f} KB")
    except Exception as e:
        print(f"  FAIL {slug}: {e}")

print("\nDone.")
