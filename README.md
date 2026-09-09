# dhreian-web

Sitio oficial de **dhreian**, artista, productor musical y desarrollador.

[Abrir Sitio](https://dhreian.com)

## Descripción

dhreian-web reúne el catálogo musical, los beats, los servicios de producción, los plugins de
audio y las herramientas web de dhreian en una experiencia bilingüe y adaptable. La interfaz está
construida con React y Vite, mientras que las rutas públicas se prerenderizan durante la
compilación para ofrecer contenido indexable desde la primera respuesta.

El sitio también incluye funciones serverless para recibir solicitudes de contacto y distribuir
instaladores mediante enlaces temporales. Los registros y límites de uso se almacenan en
PostgreSQL, y los correos transaccionales se envían con Resend.

## Contenido y funciones

| Sección | Función |
| --- | --- |
| **Lanzamientos** | Presenta la música publicada y enlaza a Spotify, Apple Music y YouTube. |
| **Beats** | Reproduce previews desde el sitio y deriva la compra y las licencias a BeatStars. |
| **Servicios** | Detalla beat custom, producción full, mezcla y masterización con precios de referencia. |
| **Plugins** | Presenta dhreVerb y permite solicitar por correo un enlace de descarga firmado. |
| **Herramientas** | Presenta auroLab y permite solicitar por correo la descarga firmada de dhreLink. |
| **Contacto** | Recibe solicitudes, las registra y envía una confirmación automática al remitente. |

Además:

- La interfaz está disponible en español e inglés.
- La preferencia de idioma se conserva únicamente en `localStorage`.
- La navegación interna utiliza History API y desplaza la vista a cada sección sin recargar la
  aplicación.
- Los enlaces de plataformas compatibles intentan abrir sus aplicaciones nativas en dispositivos
  móviles y conservan la URL web como alternativa.
- El diseño se adapta a escritorio y dispositivos móviles e incluye estados de foco visibles en
  los controles principales.

## Arquitectura de la aplicación

Vite genera el paquete del cliente y, a continuación, `scripts/prerender.mjs` renderiza la
aplicación con React DOM Server para cada ruta indexable. En el navegador, React hidrata ese HTML y
mantiene la navegación entre secciones.

Las responsabilidades principales se distribuyen así:

- `src/components/` contiene las secciones y los controles reutilizables de la interfaz.
- `src/data/site.js` centraliza catálogos, servicios, enlaces y datos visibles del sitio.
- `src/i18n/` contiene los textos en español e inglés y administra la preferencia del usuario.
- `src/seo/metadata.js` define metadatos, rutas canónicas y datos estructurados.
- `api/` contiene las funciones serverless de contacto y descarga de plugins.
- `lib/` concentra el catálogo descargable, el acceso a PostgreSQL, la protección de formularios
  y la firma de enlaces.
- `database/` conserva el esquema SQL de las tablas utilizadas por el servidor.
- `public/downloads/` organiza los instaladores por producto; las demás carpetas públicas conservan
  imágenes, audio, fuentes y metadatos estáticos.

### Flujos del servidor

El formulario de contacto y la solicitud de plugins validan el origen, el tipo de contenido, un
campo honeypot y un tiempo mínimo de llenado. Después aplican límites por dirección IP y correo,
guardan la solicitud en PostgreSQL y envían el mensaje mediante Resend.

Los instaladores de dhreVerb y dhreLink se organizan por producto en `public/downloads/`. La interfaz
mantiene el flujo gestionado por correo: el servidor genera un enlace firmado con una vigencia de
24 horas y, cuando se utiliza, entrega el archivo local o lo transmite desde la URL HTTPS configurada
por el propietario del despliegue.

## Rutas y SEO

| Ruta | Vista |
| --- | --- |
| `/` | Inicio y lanzamientos |
| `/beats` | Catálogo de beats |
| `/servicios` | Servicios de producción |
| `/plugins` | Plugins de audio |
| `/herramientas` | Herramientas de producción y streaming |
| `/contacto` | Contacto |

`/portfolio`, `/instrumentales`, `/services`, `/tools` y `/contact` redirigen a sus rutas canónicas
mediante la configuración de Vercel.

Cada ruta indexable recibe título, descripción, URL canónica, metadatos para Open Graph y Twitter,
y datos estructurados Schema.org en formato JSON-LD. El repositorio también incluye `robots.txt`,
un sitemap XML y una imagen social predeterminada.

## Tecnologías

- [React 19](https://react.dev/) para la interfaz y la hidratación del contenido prerenderizado.
- [Vite 8](https://vite.dev/) para desarrollo, compilación y carga de módulos durante el
  prerenderizado.
- [Tailwind CSS 4](https://tailwindcss.com/) para el sistema visual adaptable.
- [Font Awesome](https://fontawesome.com/) para iconografía.
- Funciones serverless de Vercel para contacto y distribución de archivos.
- [Neon](https://neon.com/) y PostgreSQL para solicitudes, estados de envío y límites de uso.
- [Resend](https://resend.com/) para correos transaccionales.

## Estructura del proyecto

```text
dhreian-web/
├── api/                         Funciones serverless de contacto y plugins
├── database/                    Esquema PostgreSQL
├── lib/                         Persistencia, seguridad y enlaces firmados
├── public/                      Audio, imágenes, fuentes y archivos públicos
├── scripts/
│   └── prerender.mjs            Generación de HTML por ruta
├── src/
│   ├── components/              Secciones y componentes reutilizables
│   ├── data/                    Catálogos y configuración visible
│   ├── i18n/                    Traducciones y estado de idioma
│   ├── seo/                     Metadatos y datos estructurados
│   ├── App.jsx                  Aplicación y navegación principal
│   ├── entry-server.jsx         Entrada de renderizado en servidor
│   ├── index.css                Estilos globales
│   └── main.jsx                 Entrada e hidratación del cliente
├── .env.example
├── vercel.json                  Redirecciones, cabeceras y caché
└── vite.config.js
```

## Requisitos

- Node.js `20.19` o superior, o `22.12` o superior, según los requisitos de Vite 8.
- npm.
- Una base PostgreSQL compatible con `DATABASE_URL` para utilizar los formularios.
- Una cuenta y una clave de Resend para enviar correos transaccionales.
- Un entorno compatible con las funciones de `api/`, como Vercel, para probar el flujo completo.

## Contacto

- **Nombre:** Luis Melita Cruces.
- **Correo:** [melitacruces@gmail.com](mailto:melitacruces@gmail.com).
- **LinkedIn:** [linkedin.com/in/melitacruces](https://linkedin.com/in/melitacruces).
- **GitHub:** [github.com/melitacruces](https://github.com/melitacruces).
- **Ubicación:** Concepción, Chile.
