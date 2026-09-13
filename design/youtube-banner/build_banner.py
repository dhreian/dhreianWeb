from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


WIDTH = 2560
HEIGHT = 1440
SAFE_AREA = (507, 509, 2053, 932)

COLORS = {
    "page": "#000000",
    "dark": "#1D1727",
    "dark_hover": "#2A2038",
    "card": "#FBFAFF",
    "border": "#E2DBEA",
    "accent": "#874DFA",
    "white": "#FFFFFF",
}


def rgba(hex_color: str, alpha: int = 255) -> tuple[int, int, int, int]:
    color = hex_color.lstrip("#")
    return tuple(int(color[index : index + 2], 16) for index in (0, 2, 4)) + (alpha,)


def load_font(path: Path, size: int, weight: int | None = None) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(path), size=size)
    if weight is not None:
        font.set_variation_by_axes([weight])
    return font


def draw_four_point_star(
    draw: ImageDraw.ImageDraw,
    center: tuple[float, float],
    radius: float,
    fill: tuple[int, int, int, int],
) -> None:
    x, y = center
    inner = radius * 0.2
    draw.polygon(
        [
            (x, y - radius),
            (x + inner, y - inner),
            (x + radius, y),
            (x + inner, y + inner),
            (x, y + radius),
            (x - inner, y + inner),
            (x - radius, y),
            (x - inner, y - inner),
        ],
        fill=fill,
    )


def draw_suit(
    draw: ImageDraw.ImageDraw,
    suit: str,
    center: tuple[int, int],
    size: int,
    fill: tuple[int, int, int, int],
) -> None:
    x, y = center
    half = size // 2

    if suit == "diamond":
        draw.polygon([(x, y - half), (x + half, y), (x, y + half), (x - half, y)], fill=fill)
        return

    if suit == "heart":
        radius = size * 0.27
        draw.ellipse((x - half, y - half * 0.62, x - half + radius * 2, y - half * 0.62 + radius * 2), fill=fill)
        draw.ellipse((x + half - radius * 2, y - half * 0.62, x + half, y - half * 0.62 + radius * 2), fill=fill)
        draw.polygon([(x - half, y - size * 0.15), (x + half, y - size * 0.15), (x, y + half)], fill=fill)
        return

    if suit == "spade":
        draw.polygon([(x, y - half), (x + half, y + size * 0.12), (x, y), (x - half, y + size * 0.12)], fill=fill)
        draw.ellipse((x - half, y - size * 0.02, x, y + half * 0.72), fill=fill)
        draw.ellipse((x, y - size * 0.02, x + half, y + half * 0.72), fill=fill)
        draw.polygon([(x - size * 0.12, y + size * 0.12), (x + size * 0.12, y + size * 0.12), (x + size * 0.2, y + half), (x - size * 0.2, y + half)], fill=fill)
        return

    radius = size * 0.22
    draw.ellipse((x - radius, y - half, x + radius, y - half + radius * 2), fill=fill)
    draw.ellipse((x - half, y - radius * 0.45, x - half + radius * 2, y + radius * 1.55), fill=fill)
    draw.ellipse((x + half - radius * 2, y - radius * 0.45, x + half, y + radius * 1.55), fill=fill)
    draw.polygon([(x - size * 0.11, y), (x + size * 0.11, y), (x + size * 0.2, y + half), (x - size * 0.2, y + half)], fill=fill)


def card_layer(
    fonts: dict[str, ImageFont.FreeTypeFont],
    rank: str,
    suit: str,
    size: tuple[int, int] = (330, 470),
    opacity: int = 205,
) -> Image.Image:
    width, height = size
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    fill = rgba(COLORS["dark"], opacity)
    outline = rgba(COLORS["accent"], min(235, opacity + 20))
    subtle = rgba(COLORS["border"], min(110, opacity // 2))

    draw.rounded_rectangle((3, 3, width - 4, height - 4), radius=27, fill=fill, outline=outline, width=4)
    draw.rounded_rectangle((22, 22, width - 23, height - 23), radius=17, outline=subtle, width=2)
    draw.text((34, 25), rank, font=fonts["card"], fill=rgba(COLORS["card"], min(190, opacity)))
    draw_suit(draw, suit, (59, 105), 38, outline)
    draw_four_point_star(draw, (width / 2, height / 2), 18, rgba(COLORS["accent"], min(140, opacity)))
    draw_suit(draw, suit, (width - 58, height - 77), 34, subtle)
    return layer


def paste_rotated_card(
    canvas: Image.Image,
    fonts: dict[str, ImageFont.FreeTypeFont],
    center: tuple[int, int],
    angle: float,
    rank: str,
    suit: str,
    size: tuple[int, int] = (330, 470),
    opacity: int = 205,
) -> None:
    card = card_layer(fonts, rank, suit, size=size, opacity=opacity)
    rotated = card.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    x = round(center[0] - rotated.width / 2)
    y = round(center[1] - rotated.height / 2)
    canvas.alpha_composite(rotated, (x, y))


def draw_flat_logo(canvas: Image.Image, logo_path: Path, box: tuple[int, int, int, int]) -> None:
    left, top, right, bottom = box
    size = (right - left, bottom - top)
    source = Image.open(logo_path).convert("RGBA")
    source.thumbnail(size, Image.Resampling.LANCZOS)
    flat = Image.new("RGBA", source.size, rgba(COLORS["accent"]))
    flat.putalpha(source.getchannel("A"))
    x = left + (size[0] - flat.width) // 2
    y = top + (size[1] - flat.height) // 2
    canvas.alpha_composite(flat, (x, y))


def tracked_text_width(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, spacing: int) -> int:
    return sum(round(draw.textlength(character, font=font)) + spacing for character in text) - spacing


def draw_tracked_text(
    draw: ImageDraw.ImageDraw,
    position: tuple[int, int],
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int, int],
    spacing: int,
) -> None:
    x, y = position
    for character in text:
        draw.text((x, y), character, font=font, fill=fill)
        x += round(draw.textlength(character, font=font)) + spacing


def build_banner(repo_root: Path, show_guide: bool = False) -> Image.Image:
    fonts_dir = repo_root / "public" / "fonts"
    fonts = {
        "title": load_font(fonts_dir / "quintessential-v24-latin-regular.woff2", 174),
        "subtitle": load_font(fonts_dir / "montserrat-v31-latin-variable.woff2", 30, 600),
        "card": load_font(fonts_dir / "montserrat-v31-latin-variable.woff2", 47, 400),
        "guide": load_font(fonts_dir / "montserrat-v31-latin-variable.woff2", 22, 600),
    }

    canvas = Image.new("RGBA", (WIDTH, HEIGHT), rgba(COLORS["page"]))
    draw = ImageDraw.Draw(canvas, "RGBA")

    # Eight cards cross the desktop-visible strip; the nearest pair also peeks into the universal crop.
    card_specs = [
        ((90, 720), -11, "A", "spade", (330, 470), 215),
        ((330, 742), 8, "K", "heart", (320, 455), 225),
        ((555, 706), -5, "Q", "diamond", (300, 430), 190),
        ((795, 735), 9, "J", "club", (280, 405), 105),
        ((1810, 718), -8, "10", "spade", (280, 405), 105),
        ((2040, 735), 6, "Q", "diamond", (300, 430), 190),
        ((2280, 704), -7, "K", "heart", (320, 455), 225),
        ((2510, 740), 10, "A", "club", (330, 470), 215),
    ]
    for center, angle, rank, suit, size, opacity in card_specs:
        paste_rotated_card(canvas, fonts, center, angle, rank, suit, size=size, opacity=opacity)

    # Flat website monogram and typography lockup, contained in the all-device safe area.
    draw_flat_logo(
        canvas,
        repo_root / "design" / "brand" / "logo" / "final" / "dhreian-monogram-transparent-4096.png",
        (610, 554, 930, 874),
    )

    draw = ImageDraw.Draw(canvas, "RGBA")
    title_x = 1010
    title_y = 563
    draw.text((title_x, title_y), "dhreian", font=fonts["title"], fill=rgba(COLORS["accent"]))

    subtitle = "artista · productor · desarrollador"
    subtitle_spacing = 3
    subtitle_width = tracked_text_width(draw, subtitle, fonts["subtitle"], subtitle_spacing)
    subtitle_y = 799
    draw_tracked_text(
        draw,
        (title_x + 8, subtitle_y),
        subtitle,
        fonts["subtitle"],
        rgba(COLORS["card"]),
        subtitle_spacing,
    )
    draw.rectangle((title_x + 8, subtitle_y + 57, title_x + 8 + subtitle_width, subtitle_y + 61), fill=rgba(COLORS["accent"]))
    draw_four_point_star(draw, (966, 721), 12, rgba(COLORS["card"]))
    draw_four_point_star(draw, (1944, 721), 10, rgba(COLORS["accent"]))

    if show_guide:
        left, top, right, bottom = SAFE_AREA
        overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        guide = ImageDraw.Draw(overlay, "RGBA")
        shade = (0, 0, 0, 118)
        guide.rectangle((0, 0, WIDTH, top), fill=shade)
        guide.rectangle((0, bottom, WIDTH, HEIGHT), fill=shade)
        guide.rectangle((0, top, left, bottom), fill=shade)
        guide.rectangle((right, top, WIDTH, bottom), fill=shade)
        canvas.alpha_composite(overlay)
        draw = ImageDraw.Draw(canvas, "RGBA")
        dash = 18
        for x in range(left, right, dash * 2):
            draw.line((x, top, min(x + dash, right), top), fill=(50, 170, 255, 255), width=4)
            draw.line((x, bottom, min(x + dash, right), bottom), fill=(50, 170, 255, 255), width=4)
        for y in range(top, bottom, dash * 2):
            draw.line((left, y, left, min(y + dash, bottom)), fill=(50, 170, 255, 255), width=4)
            draw.line((right, y, right, min(y + dash, bottom)), fill=(50, 170, 255, 255), width=4)
        label = "ÁREA SEGURA · TODOS LOS DISPOSITIVOS"
        label_box = draw.textbbox((0, 0), label, font=fonts["guide"])
        label_width = label_box[2] - label_box[0]
        draw.rectangle((left + 18, top - 43, left + 42 + label_width, top - 7), fill=rgba(COLORS["dark"]))
        draw.text((left + 30, top - 40), label, font=fonts["guide"], fill=rgba(COLORS["white"]))

    return canvas


def main() -> None:
    parser = argparse.ArgumentParser(description="Genera el banner de canal de dhreian.")
    parser.add_argument("--output-directory", type=Path, default=Path(__file__).parent)
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    repo_root = script_dir.parents[1]
    output_directory = args.output_directory.resolve()
    output_directory.mkdir(parents=True, exist_ok=True)

    banner = build_banner(repo_root)
    png_path = output_directory / "youtube-channel-banner-2560x1440.png"
    jpg_path = output_directory / "youtube-channel-banner-2560x1440.jpg"
    banner_rgb = banner.convert("RGB")
    banner_rgb.save(png_path, format="PNG", optimize=True)
    banner_rgb.save(jpg_path, format="JPEG", quality=94, optimize=True, progressive=True)

    guide = build_banner(repo_root, show_guide=True)
    guide_path = output_directory / "youtube-channel-banner-safe-area-guide.png"
    guide.save(guide_path, format="PNG", optimize=True)

    for path in (png_path, jpg_path, guide_path):
        with Image.open(path) as image:
            print(f"{path.name}: {image.width}x{image.height}, {path.stat().st_size} bytes")


if __name__ == "__main__":
    main()
