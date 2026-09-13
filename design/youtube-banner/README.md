# Banner de YouTube — dhreian

Banner de canal construido por código para conservar la estética plana del sitio: fondo negro puro `#000000`, acento morado `#874DFA`, monograma plano, motivos de cartas y las tipografías Quintessential y Montserrat. El PNG principal se exporta en RGB, sin canal alfa.

## Archivos

- `youtube-channel-banner-2560x1440.png`: entrega principal lista para subir a YouTube.
- `youtube-channel-banner-2560x1440.jpg`: alternativa más liviana.
- `youtube-channel-banner-safe-area-guide.png`: vista de control; no subir esta version.
- `build_banner.py`: fuente editable del diseño y generador de las tres imágenes.
- `build-banner.ps1`: lanzador para Windows que localiza Python y ejecuta el generador.

## Medidas

- Lienzo: `2560 x 1440 px`.
- Área segura para texto y logo: `1546 x 423 px`, centrada en `x=507`, `y=509`.
- El contenido esencial queda dentro del área segura mostrada en la captura de referencia.

## Regenerar

Desde esta carpeta:

```powershell
.\build-banner.ps1
```

Desde la raiz del repositorio:

```powershell
.\design\youtube-banner\build-banner.ps1
```

El generador usa Pillow, las fuentes locales de `public/fonts/` y la silueta alfa del monograma maestro. La silueta se rellena con el color plano `#874DFA`, igual que el logo aplicado por CSS en la web.
