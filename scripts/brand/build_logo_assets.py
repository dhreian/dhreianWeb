"""Build production-ready logo files from the approved raster concept.

The script removes a green-screen or neutral preview background, crops to the
visible mark, adds a small safety margin, and exports a 4096 px transparent PNG
plus checkerboard and dark-background previews. It deliberately does not modify
any website source.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageColor, ImageDraw, ImageFilter


EXPORT_SIZES = (4096, 2048, 1024, 512, 256, 128)
UNDER_ONE_MB_CANDIDATES = (2048, 1792, 1536, 1280, 1024)
UNDER_ONE_MB_LIMIT = 1_000_000
DEFAULT_BRAND_COLOR = "#681cff"


def smoothstep(values: np.ndarray, low: float, high: float) -> np.ndarray:
    scaled = np.clip((values - low) / (high - low), 0.0, 1.0)
    return scaled * scaled * (3.0 - 2.0 * scaled)


def corner_median(rgb: np.ndarray) -> np.ndarray:
    height, width, _ = rgb.shape
    sample_height = max(8, height // 10)
    sample_width = max(8, width // 10)
    corners = np.concatenate(
        (
            rgb[:sample_height, :sample_width].reshape(-1, 3),
            rgb[:sample_height, -sample_width:].reshape(-1, 3),
            rgb[-sample_height:, :sample_width].reshape(-1, 3),
            rgb[-sample_height:, -sample_width:].reshape(-1, 3),
        )
    )
    return np.median(corners, axis=0)


def extract_logo(image: Image.Image) -> Image.Image:
    """Extract a purple/black mark from a green or neutral preview background."""
    rgb = np.asarray(image.convert("RGB"), dtype=np.float32)
    red, green, blue = np.moveaxis(rgb, -1, 0)
    luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue

    screen = corner_median(rgb)
    screen_green_excess = screen[1] - max(screen[0], screen[2])
    if screen_green_excess > 100.0:
        # Estimate coverage from distance to the green screen, then reverse the
        # screen composite to remove green spill from antialiased pixels.
        green_excess = green - np.maximum(red, blue)
        alpha = 1.0 - smoothstep(green_excess, 18.0, screen_green_excess * 0.91)
        safe_alpha = np.maximum(alpha, 0.03)[..., None]
        recovered = (rgb - (1.0 - alpha[..., None]) * screen) / safe_alpha
        edge = (alpha > 0.03) & (alpha < 0.995)
        rgb[edge] = np.clip(recovered[edge], 0.0, 255.0)

        # Suppress any residual green fringe without changing opaque violet
        # highlights. A valid purple edge keeps green below both red and blue.
        red, green, blue = np.moveaxis(rgb, -1, 0)
        minimum_violet = np.minimum(red, blue)
        maximum_violet = np.maximum(red, blue)
        spill = (
            (alpha > 0.03)
            & (green > minimum_violet * 0.92)
            & (green > maximum_violet * 0.72)
        )
        violet_green_limit = minimum_violet * 0.78
        green[spill] = np.minimum(green[spill], violet_green_limit[spill])
        rgb = np.stack((red, green, blue), axis=-1)
    else:
        # Fallback for a neutral preview: violet scoring selects the mark while
        # dark scoring retains its near-black metallic recesses.
        violet_signal = np.maximum(red - green, blue - green)
        violet_hue = (blue > green + 3.0) & (red > green + 1.0)
        color_alpha = smoothstep(violet_signal, 3.0, 24.0) * violet_hue
        dark_alpha = smoothstep(166.0 - luminance, 0.0, 62.0)
        alpha = np.maximum(color_alpha, dark_alpha)

    # Remove tiny low-confidence artifacts and softly antialias the contour.
    alpha[alpha < 0.025] = 0.0
    alpha_image = Image.fromarray(np.uint8(np.clip(alpha * 255.0, 0, 255)), "L")
    alpha_image = alpha_image.filter(ImageFilter.GaussianBlur(radius=0.45))

    # Reject isolated colored flecks from the generated checkerboard while
    # retaining a one-pixel antialiased boundary around the connected strokes.
    support = alpha_image.point(lambda value: 255 if value >= 34 else 0)
    support = support.filter(ImageFilter.MedianFilter(size=3))
    support = support.filter(ImageFilter.MaxFilter(size=3))
    alpha_array = np.asarray(alpha_image, dtype=np.uint8).copy()
    alpha_array[np.asarray(support) == 0] = 0
    alpha_image = Image.fromarray(alpha_array, "L")

    # Hidden RGB must not retain the chroma-key color, otherwise resampling can
    # pull green into the antialiased boundary during enlargement.
    rgb[alpha_array == 0] = 0.0

    rgba = Image.fromarray(np.uint8(np.clip(rgb, 0, 255)), "RGB").convert("RGBA")
    rgba.putalpha(alpha_image)
    return rgba


def recolor_logo(mark: Image.Image, color: str) -> Image.Image:
    """Anchor the metallic palette to one hue while retaining light and depth."""
    target_rgb = ImageColor.getrgb(color)
    target_hsv = Image.new("RGB", (1, 1), target_rgb).convert("HSV").getpixel((0, 0))

    rgb_image = mark.convert("RGB")
    hsv = np.asarray(rgb_image.convert("HSV"), dtype=np.uint8).copy()
    alpha = np.asarray(mark.getchannel("A"), dtype=np.uint8)
    visible = alpha > 0

    original_saturation = hsv[..., 1].astype(np.float32) / 255.0
    metallic_saturation = target_hsv[1] * np.power(original_saturation, 0.42)
    hsv[..., 0][visible] = target_hsv[0]
    hsv[..., 1][visible] = np.uint8(np.clip(metallic_saturation[visible], 0, 255))

    recolored_rgb = np.asarray(Image.fromarray(hsv, "HSV").convert("RGB"), dtype=np.uint8).copy()
    recolored_rgb[~visible] = 0
    recolored = Image.fromarray(recolored_rgb, "RGB").convert("RGBA")
    recolored.putalpha(mark.getchannel("A"))
    return recolored


def fit_square(mark: Image.Image, size: int, margin_ratio: float) -> Image.Image:
    alpha = mark.getchannel("A")
    bbox = alpha.point(lambda value: 255 if value > 2 else 0).getbbox()
    if bbox is None:
        raise ValueError("No visible logo pixels were detected")

    cropped = mark.crop(bbox)
    margin = max(1, round(size * margin_ratio))
    available = size - 2 * margin
    scale = min(available / cropped.width, available / cropped.height)
    target = (max(1, round(cropped.width * scale)), max(1, round(cropped.height * scale)))
    resized = cropped.resize(target, Image.Resampling.LANCZOS)

    # A restrained sharpen compensates for the enlargement without creating
    # brittle halos around the transparent edge.
    resized = resized.filter(ImageFilter.UnsharpMask(radius=1.15, percent=72, threshold=3))
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    position = ((size - target[0]) // 2, (size - target[1]) // 2)
    canvas.alpha_composite(resized, position)
    return canvas


def checkerboard(size: int, cell: int = 40) -> Image.Image:
    board = Image.new("RGB", (size, size), "#f1f1f4")
    draw = ImageDraw.Draw(board)
    alternate = "#d8d8de"
    for y in range(0, size, cell):
        for x in range(0, size, cell):
            if (x // cell + y // cell) % 2:
                draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill=alternate)
    return board


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="PNG", optimize=True, compress_level=9)


def resized_master(master: Image.Image, size: int) -> Image.Image:
    if master.size == (size, size):
        return master.copy()
    return master.resize((size, size), Image.Resampling.LANCZOS)


def file_record(path: Path, usage: str) -> dict[str, object]:
    with path.open("rb") as file_handle:
        digest = hashlib.sha256(file_handle.read()).hexdigest()
    with Image.open(path) as image:
        return {
            "file": path.name,
            "width": image.width,
            "height": image.height,
            "mode": image.mode,
            "bytes": path.stat().st_size,
            "sha256": digest,
            "usage": usage,
        }


def export_resolution_pack(master: Image.Image, export_dir: Path, brand_color: str) -> None:
    export_dir.mkdir(parents=True, exist_ok=True)
    usages = {
        4096: "master, large-format artwork and archival reuse",
        2048: "high-density presentations, covers and large digital layouts",
        1024: "websites, social profiles and general digital use",
        512: "application icons, avatars and UI at high density",
        256: "compact interface elements and profile thumbnails",
        128: "small navigation, launcher and favicon source",
    }

    records: list[dict[str, object]] = []
    for export_size in EXPORT_SIZES:
        path = export_dir / f"dhreian-logo-transparent-{export_size}.png"
        save_png(resized_master(master, export_size), path)
        records.append(file_record(path, usages[export_size]))

    lightweight_path = export_dir / "dhreian-logo-transparent-under-1mb.png"
    for candidate_size in UNDER_ONE_MB_CANDIDATES:
        save_png(resized_master(master, candidate_size), lightweight_path)
        if lightweight_path.stat().st_size < UNDER_ONE_MB_LIMIT:
            break
    else:
        raise ValueError("Unable to produce an RGBA PNG below 1 MB")

    records.append(file_record(lightweight_path, "portable transparent PNG below 1 MB"))
    manifest_path = export_dir / "manifest.json"
    manifest_path.write_text(
        json.dumps({"brandColor": brand_color.lower(), "files": records}, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def build(
    input_path: Path,
    output_path: Path,
    preview_path: Path,
    dark_preview_path: Path,
    exports_dir: Path | None,
    size: int,
    margin: float,
    color: str,
) -> None:
    source = Image.open(input_path)
    extracted = extract_logo(source)
    master = fit_square(recolor_logo(extracted, color), size=size, margin_ratio=margin)

    save_png(master, output_path)

    if exports_dir is not None:
        export_resolution_pack(master, exports_dir, color)

    preview_size = min(1600, size)
    preview_mark = master.resize((preview_size, preview_size), Image.Resampling.LANCZOS)
    preview = checkerboard(preview_size).convert("RGBA")
    preview.alpha_composite(preview_mark)
    preview_path.parent.mkdir(parents=True, exist_ok=True)
    preview.convert("RGB").save(preview_path, format="PNG", optimize=True, compress_level=9)

    dark_preview = Image.new("RGBA", (preview_size, preview_size), "#050507")
    dark_preview.alpha_composite(preview_mark)
    dark_preview_path.parent.mkdir(parents=True, exist_ok=True)
    dark_preview.convert("RGB").save(dark_preview_path, format="PNG", optimize=True, compress_level=9)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="Polished RGB source image")
    parser.add_argument("output", type=Path, help="Transparent PNG output path")
    parser.add_argument("preview", type=Path, help="Checkerboard preview output path")
    parser.add_argument("dark_preview", type=Path, help="Dark-background preview output path")
    parser.add_argument("--exports-dir", type=Path, help="Optional directory for reusable sizes")
    parser.add_argument("--size", type=int, default=4096, help="Square master size in pixels")
    parser.add_argument("--margin", type=float, default=0.016, help="Transparent safety margin ratio")
    parser.add_argument("--color", default=DEFAULT_BRAND_COLOR, help="Base brand color as a CSS hex value")
    return parser.parse_args()


if __name__ == "__main__":
    arguments = parse_args()
    build(
        arguments.input,
        arguments.output,
        arguments.preview,
        arguments.dark_preview,
        arguments.exports_dir,
        arguments.size,
        arguments.margin,
        arguments.color,
    )
