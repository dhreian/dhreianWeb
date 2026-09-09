"""Create browser, search, Apple and PWA icons from the transparent logo master."""

from __future__ import annotations

import argparse
import base64
import hashlib
import io
import json
import shutil
from pathlib import Path

from PIL import Image, ImageColor


BACKGROUND = "#050507"
LIGHT_MODE_COLOR = "#000000"
DARK_MODE_COLOR = "#ffffff"
OBSOLETE_OUTLINE_FILES = (
    "web-app-outline-192.png",
    "web-app-outline-512.png",
)


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="PNG", optimize=True, compress_level=9)


def visible_mark(master: Image.Image) -> Image.Image:
    alpha = master.getchannel("A")
    bbox = alpha.point(lambda value: 255 if value > 2 else 0).getbbox()
    if bbox is None:
        raise ValueError("The master does not contain visible logo pixels")
    return master.crop(bbox)


def compose_icon(
    master: Image.Image,
    size: int,
    content_ratio: float,
    background: str | None = None,
) -> Image.Image:
    canvas_color = background if background is not None else (0, 0, 0, 0)
    canvas = Image.new("RGBA", (size, size), canvas_color)
    cropped = visible_mark(master)
    available = max(1, round(size * content_ratio))
    scale = min(available / cropped.width, available / cropped.height)
    target = (max(1, round(cropped.width * scale)), max(1, round(cropped.height * scale)))
    mark = cropped.resize(target, Image.Resampling.LANCZOS)
    offset = ((size - target[0]) // 2, (size - target[1]) // 2)
    canvas.alpha_composite(mark, offset)
    return canvas


def monochrome_icon(
    master: Image.Image,
    size: int,
    color: str,
    content_ratio: float = 1.0,
    background: str | None = None,
) -> Image.Image:
    source = compose_icon(master, size, content_ratio=content_ratio)
    alpha = source.getchannel("A")
    red, green, blue = ImageColor.getrgb(color)
    mark = Image.new("RGBA", (size, size), (red, green, blue, 0))
    mark.putalpha(alpha)
    if background is None:
        return mark

    output = Image.new("RGBA", (size, size), background)
    output.alpha_composite(mark)
    return output


def save_adaptive_favicon(master: Image.Image, path: Path) -> None:
    """Create one SVG favicon that follows the browser/device color scheme."""
    mask = monochrome_icon(master, 512, DARK_MODE_COLOR).getchannel("A")
    buffer = io.BytesIO()
    mask.save(buffer, format="PNG", optimize=True, compress_level=9)
    encoded_mask = base64.b64encode(buffer.getvalue()).decode("ascii")
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <style>
    :root {{ color: {LIGHT_MODE_COLOR}; }}
    @media (prefers-color-scheme: dark) {{ :root {{ color: {DARK_MODE_COLOR}; }} }}
  </style>
  <mask id="logo" mask-type="alpha">
    <image width="512" height="512" href="data:image/png;base64,{encoded_mask}" />
  </mask>
  <rect width="512" height="512" fill="currentColor" mask="url(#logo)" />
</svg>
"""
    path.write_text(svg, encoding="utf-8")


def record(path: Path, purpose: str) -> dict[str, object]:
    with path.open("rb") as file_handle:
        checksum = hashlib.sha256(file_handle.read()).hexdigest()
    if path.suffix.lower() == ".svg":
        width, height, mode = 512, 512, "SVG"
    else:
        with Image.open(path) as image:
            width, height, mode = image.width, image.height, image.mode
    return {
        "file": path.name,
        "width": width,
        "height": height,
        "mode": mode,
        "bytes": path.stat().st_size,
        "sha256": checksum,
        "purpose": purpose,
    }


def publish_icons(output_dir: Path, public_dir: Path) -> None:
    root_files = (
        "favicon.svg",
        "favicon.ico",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "favicon-48x48.png",
        "favicon-96x96.png",
        "apple-touch-icon.png",
    )
    icon_files = (
        "web-app-icon-192.png",
        "web-app-icon-512.png",
        "web-app-maskable-safe-192.png",
        "web-app-maskable-safe-512.png",
        "web-app-monochrome-512.png",
        "seo-organization-logo-512.png",
    )

    public_dir.mkdir(parents=True, exist_ok=True)
    public_icons = public_dir / "icons"
    public_icons.mkdir(parents=True, exist_ok=True)
    for filename in OBSOLETE_OUTLINE_FILES:
        (public_icons / filename).unlink(missing_ok=True)
    for filename in root_files:
        shutil.copy2(output_dir / filename, public_dir / filename)
    for filename in icon_files:
        shutil.copy2(output_dir / filename, public_icons / filename)


def build(
    master_path: Path,
    output_dir: Path,
    public_dir: Path | None = None,
) -> None:
    master = Image.open(master_path).convert("RGBA")
    output_dir.mkdir(parents=True, exist_ok=True)
    for filename in OBSOLETE_OUTLINE_FILES:
        (output_dir / filename).unlink(missing_ok=True)
    records: list[dict[str, object]] = []

    favicon_sizes = (16, 32, 48, 96)
    for size in favicon_sizes:
        path = output_dir / f"favicon-{size}x{size}.png"
        save_png(monochrome_icon(master, size, DARK_MODE_COLOR), path)
        purpose = "white monochrome Google Search and browser favicon" if size in (48, 96) else "white monochrome browser tab favicon"
        records.append(record(path, purpose))

    svg_path = output_dir / "favicon.svg"
    save_adaptive_favicon(master, svg_path)
    records.append(record(svg_path, "adaptive browser favicon: black in light mode, white in dark mode"))

    ico_path = output_dir / "favicon.ico"
    ico_source = monochrome_icon(master, 256, DARK_MODE_COLOR)
    ico_source.save(
        ico_path,
        format="ICO",
        sizes=((16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)),
    )
    records.append(record(ico_path, "white monochrome multi-resolution legacy browser favicon"))

    apple_path = output_dir / "apple-touch-icon.png"
    save_png(monochrome_icon(master, 180, DARK_MODE_COLOR, background=BACKGROUND), apple_path)
    records.append(record(apple_path, "white monochrome Apple home-screen web clip on dark background"))

    for size in (192, 512):
        regular_path = output_dir / f"web-app-icon-{size}.png"
        save_png(monochrome_icon(master, size, DARK_MODE_COLOR), regular_path)
        records.append(record(regular_path, "white monochrome web app icon with transparent background"))

        maskable_path = output_dir / f"web-app-maskable-{size}.png"
        save_png(monochrome_icon(master, size, DARK_MODE_COLOR, background=BACKGROUND), maskable_path)
        records.append(record(maskable_path, "white monochrome full-bleed PWA icon on dark background"))

        safe_path = output_dir / f"web-app-maskable-safe-{size}.png"
        save_png(monochrome_icon(master, size, DARK_MODE_COLOR, content_ratio=0.72, background=BACKGROUND), safe_path)
        records.append(record(safe_path, "white monochrome maskable PWA icon with protective padding"))

    monochrome_path = output_dir / "web-app-monochrome-512.png"
    save_png(monochrome_icon(master, 512, DARK_MODE_COLOR), monochrome_path)
    records.append(record(monochrome_path, "white alpha silhouette for manifest purpose monochrome"))

    seo_path = output_dir / "seo-organization-logo-512.png"
    save_png(monochrome_icon(master, 512, DARK_MODE_COLOR), seo_path)
    records.append(record(seo_path, "white monochrome Organization structured-data logo"))

    (output_dir / "manifest.json").write_text(
        json.dumps(
            {
                "palette": {"lightMode": LIGHT_MODE_COLOR, "darkMode": DARK_MODE_COLOR},
                "files": records,
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )

    if public_dir is not None:
        publish_icons(output_dir, public_dir)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("master", type=Path, help="4096 px transparent RGBA logo master")
    parser.add_argument("output_dir", type=Path, help="Destination for the icon package")
    parser.add_argument("--public-dir", type=Path, help="Optional Vite public directory to update")
    return parser.parse_args()


if __name__ == "__main__":
    arguments = parse_args()
    build(arguments.master, arguments.output_dir, arguments.public_dir)
