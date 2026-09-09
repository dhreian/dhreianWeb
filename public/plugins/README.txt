CARPETA DE IMÁGENES DE PLUGINS
==============================

Acá van los product shots de los plugins que se muestran en la
sección "plugins de audio" de la web.

Convención de nombres recomendada (por key del plugin):

  public/plugins/<key>.png     ← captura de la GUI del plugin

Ejemplo, para el plugin con key "dhreverb":

  public/plugins/dhreverb.png

Luego en src/data/site.js editas el plugin:

  {
    key: 'dhreverb',
    image: '/plugins/dhreverb.png',     ← relativo a /public
    ...
  }

Tips:
- La tarjeta muestra la imagen con object-contain sobre fondo oscuro:
  funcionan mejor capturas con fondo transparente o oscuro.
- Formato ancho (≈16:10 o 4:3). Mínimo ~800px de ancho.
- Comprime a WebP/PNG (~100-300KB cada una).

INSTALADORES DESCARGABLES
==========================

Los binarios de instalación oficiales se almacenan por producto bajo
`public/downloads/`, o se configuran mediante una URL HTTPS en las variables de
entorno del servidor.

Para una descarga gratuita gestionada por correo:

1. En `src/data/site.js`, usa `url: null` y `downloadByEmail: true`.
2. El instalador se ubica en `public/downloads/<key>/` y se registra en
   `lib/downloadable-products.js`, o se configura su URL en la variable de
   entorno correspondiente.
3. El botón abre el modal; el endpoint valida la key, registra la solicitud
   en Neon y envía mediante Resend un enlace firmado válido por 24 horas.
4. Al abrir el enlace, el endpoint `/api/plugin-file` entrega el archivo binario.

Las URLs de tiendas para plugins de pago sí permanecen en `url` dentro de
`site.js`, porque esos CTA abren una plataforma externa.
