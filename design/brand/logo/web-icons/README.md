# Web icon package

All web-facing icons use the exact alpha silhouette from
`web-app-monochrome-512.png`. There are no strokes, borders, metallic fills or
alternate logo geometries in this package.

The modern `favicon.svg` is adaptive: it renders the mark in black when the
browser/device prefers a light color scheme and in white when it prefers a dark
color scheme. Static PNG, ICO, Apple and PWA assets use the same white silhouette;
installed-app icons use the site's dark background where an opaque canvas is
required.

Run `scripts/brand/build_web_icons.py` with `--public-dir public` to regenerate
this source package and update the website copies in one operation.

## Files

- `favicon.svg`: adaptive black/light-mode and white/dark-mode browser favicon.
- `favicon.ico`: white multi-resolution legacy browser fallback.
- `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`,
  `favicon-96x96.png`: white transparent monochrome fallbacks.
- `apple-touch-icon.png`: white silhouette on the site's opaque dark background.
- `web-app-icon-192.png`, `web-app-icon-512.png`: white transparent PWA icons.
- `web-app-maskable-192.png`, `web-app-maskable-512.png`: full-size white
  silhouette on the site's dark background.
- `web-app-maskable-safe-192.png`, `web-app-maskable-safe-512.png`: mask-safe
  white silhouette on the site's dark background.
- `web-app-monochrome-512.png`: white transparent source silhouette for manifest
  purpose `monochrome`.
- `seo-organization-logo-512.png`: white transparent logo used by the site and
  `Organization` structured data.
- `manifest.json`: dimensions, mode, byte size, SHA-256 and purpose of each file.

## Integration

```html
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

The PWA manifest uses the white transparent `web-app-icon` files for `any`, the
opaque padded files for `maskable`, and the alpha silhouette for `monochrome`.
Manifest and Apple icons are static resources and cannot follow the device theme
as reliably as the SVG browser favicon.
