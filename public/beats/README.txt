CARPETA DE ARCHIVOS DEL CATÁLOGO
================================

Acá van las carátulas y previews MP3 de los beats que se muestran
en la sección "beat store" de la web.

Convención de nombres recomendada (por slug del beat):

  public/beats/<slug>.jpg     ← carátula (cuadrada, mínimo 600x600)
  public/beats/<slug>.mp3     ← preview de audio (30-60 seg típico)

Ejemplo, para el beat con slug "noches-de-neon":

  public/beats/noches-de-neon.jpg
  public/beats/noches-de-neon.mp3

Luego en src/data/site.js editas el beat:

  {
    slug: 'noches-de-neon',
    cover: '/beats/noches-de-neon.jpg',     ← relativo a /public
    preview: '/beats/noches-de-neon.mp3',
    ...
  }

Tips:
- Mantén las carátulas en JPG/WebP comprimidos (~100-200KB cada una).
- Los MP3 a 128-192 kbps son suficientes para preview, ~500KB-1MB cada uno.
- Para 50+ beats considera migrar a Cloudinary u otro CDN.
