"""
Cuts every car out of its background so it can float on a showroom floor.

Hard-won quality notes:
  * Cut from the FULL uncropped frame (public/cars/original). Cropping first
    clipped the bottom of the tyres, which looked like a botched cut-out.
  * birefnet-general gives far cleaner vehicle masks than u2net — wheel
    spokes, mirrors and aerials survive.
  * Never erode the alpha. Eroding bites chunks out of tyres and bumpers.
  * Kill the pale halo with real colour unmixing instead: for a partly
    transparent pixel, the observed colour is  I = a*F + (1-a)*B.  We know I
    and a, and B is the (near-white) studio background sampled from the
    corners, so we can solve for the car's true colour  F = (I - (1-a)B) / a.

Outputs: public/cars/cutout/<slug>.webp

Usage: python3 scripts/cutout-cars.py
"""

import io
import os
import glob
import numpy as np
from rembg import remove, new_session
from PIL import Image

SRC = "public/cars/original"
OUT = "public/cars/cutout"
os.makedirs(OUT, exist_ok=True)

MODEL = os.environ.get("REMBG_MODEL", "birefnet-general")
session = new_session(MODEL)


def estimate_background(rgb: np.ndarray) -> np.ndarray:
    """Average the four corners — these photos all have plain light surrounds."""
    h, w, _ = rgb.shape
    k = max(8, min(h, w) // 25)
    patches = [
        rgb[:k, :k],
        rgb[:k, -k:],
        rgb[-k:, :k],
        rgb[-k:, -k:],
    ]
    return np.median(np.concatenate([p.reshape(-1, 3) for p in patches]), axis=0)


def unmix(img: Image.Image) -> Image.Image:
    """Recover each edge pixel's true colour, removing background spill."""
    arr = np.asarray(img).astype(np.float32)
    rgb, a = arr[..., :3], arr[..., 3:4] / 255.0

    bg = estimate_background(rgb).reshape(1, 1, 3)

    # Solve I = a*F + (1-a)*B  →  F = (I - (1-a)B) / a
    safe_a = np.clip(a, 0.18, 1.0)
    fg = (rgb - (1.0 - a) * bg) / safe_a
    fg = np.clip(fg, 0, 255)

    # Only rewrite pixels that are actually on the edge
    on_edge = (a > 0.02) & (a < 0.98)
    rgb = np.where(on_edge, fg, rgb)

    # Discard the faintest dust so no grey veil remains
    a = np.where(a < 0.06, 0.0, a)

    return Image.fromarray(
        np.uint8(np.clip(np.concatenate([rgb, a * 255.0], axis=-1), 0, 255)), "RGBA"
    )


def trim(img: Image.Image, pad: int = 10) -> Image.Image:
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    w, h = img.size
    canvas = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    canvas.paste(img, (pad, pad))
    return canvas


files = sorted(glob.glob(os.path.join(SRC, "*.jpg")))
print(f"Model: {MODEL}")
print(f"Found {len(files)} full-frame photos\n")

for path_ in files:
    slug = os.path.splitext(os.path.basename(path_))[0]
    try:
        with open(path_, "rb") as f:
            raw = f.read()

        cut = remove(raw, session=session)  # no matting, no erosion

        img = Image.open(io.BytesIO(cut)).convert("RGBA")
        img = unmix(img)
        img = trim(img)
        img.thumbnail((1400, 1400), Image.LANCZOS)

        dest = os.path.join(OUT, f"{slug}.webp")
        img.save(dest, "WEBP", quality=90, alpha_quality=100, method=6)

        kb = os.path.getsize(dest) / 1024
        print(f"  OK  {slug}.webp  {img.size[0]}x{img.size[1]}  {kb:.0f} KB")
    except Exception as e:
        print(f"  FAIL {slug}: {e}")

print("\nDone.")
