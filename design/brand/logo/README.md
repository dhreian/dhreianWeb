# DHREIAN monogram proposal

This folder contains the approved logo sources, reusable exports and build
scripts. The web-icon derivatives are published through matching files under
`public/`.

The current metallic palette is anchored to the brand color `#681cff`; lighter
specular highlights and darker shadows are derived from that same hue.

## Structure

- `source/logo-concept-original.jpg`: original concept supplied for the edit.
- `source/logo-polished-generated.png`: first polished working render retained for
  provenance.
- `source/logo-polished-chroma.png`: corrected polished render on a technical
  green background; this is the rebuild input.
- `final/dhreian-monogram-transparent-4096.png`: 4096 x 4096 RGBA master.
- `exports/`: portable transparent PNG files for use in other projects.
  - `4096`: master, large-format work and archive.
  - `2048`: presentations, covers and large high-density layouts.
  - `1024`: websites, social profiles and general digital use.
  - `512`: application icons, avatars and high-density UI.
  - `256`: compact interface elements and thumbnails.
  - `128`: small navigation and favicon source.
  - `under-1mb`: the highest RGBA resolution the exporter can keep below
    1,000,000 bytes.
  - `manifest.json`: dimensions, color mode, byte size, checksum and suggested
    use for every export.
- `previews/dhreian-monogram-checkerboard-1600.png`: review preview only; its
  checkerboard is intentionally baked in to make transparency easy to inspect.
- `previews/dhreian-monogram-dark-1600.png`: dark-background edge-quality check.
- `web-icons/`: source package for the browser favicon, Apple, PWA/maskable and
  SEO-ready icons currently published under `public/`.

## Rebuild

Run `scripts/brand/build_logo_assets.py` with the polished source, master output,
checkerboard preview, dark preview, and `--exports-dir` path. The default build
uses a 1.6% safety margin so the mark fills the square without clipping its
pointed extremities. Every reusable export retains real PNG alpha transparency.
