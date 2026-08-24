# dhreian-web

Sitio oficial de **dhreian**, artista, productor musical y desarrollador.

[Abrir dhreian.com](https://dhreian.com)

## Descripción

dhreian-web reúne el catálogo musical, los beats, los servicios de producción, los plugins de
audio y las herramientas web de dhreian en una experiencia bilingüe y adaptable. La interfaz está
construida con React y Vite, mientras que las rutas públicas se prerenderizan durante la
compilación para ofrecer contenido indexable desde la primera respuesta.

El sitio también incluye funciones serverless para recibir solicitudes de contacto y distribuir
instaladores privados mediante enlaces temporales. Los registros y límites de uso se almacenan en
PostgreSQL, y los correos transaccionales se envían con Resend.

## Contenido y funciones

| Sección | Función |
| --- | --- |
| **Lanzamientos** | Presenta la música publicada y enlaza a Spotify, Apple Music y YouTube. |
| **Beats** | Reproduce previews desde el sitio y deriva la compra y las licencias a BeatStars. |
| **Servicios** | Detalla beat custom, producción full, mezcla y masterización con precios de referencia. |
| **Plugins** | Presenta dhreVerb y permite solicitar por correo un enlace de descarga firmado. |
| **Herramientas** | Enlaza a auroLab y a otros recursos web creados para producción musical. |
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
- `lib/` concentra el acceso a PostgreSQL, la protección de formularios y la firma de enlaces.
- `database/` conserva el esquema SQL de las tablas utilizadas por el servidor.

### Flujos del servidor

El formulario de contacto y la solicitud de plugins validan el origen, el tipo de contenido, un
campo honeypot y un tiempo mínimo de llenado. Después aplican límites por dirección IP y correo,
guardan la solicitud en PostgreSQL y envían el mensaje mediante Resend.

El instalador de dhreVerb no se publica en el repositorio ni se expone directamente al cliente. El
servidor genera un enlace firmado con una vigencia de 24 horas y, cuando se utiliza, transmite el
archivo desde la URL HTTPS privada configurada por el propietario del despliegue.

## Rutas y SEO

| Ruta | Vista |
| --- | --- |
| `/` | Inicio y lanzamientos |
| `/beats` | Catálogo de beats |
| `/servicios` | Servicios de producción |
| `/plugins` | Plugins de audio |
| `/herramientas` | Herramientas web |
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
├── api/                         # Funciones serverless de contacto y plugins
├── database/                    # Esquema PostgreSQL
├── lib/                         # Persistencia, seguridad y enlaces firmados
├── public/                      # Audio, imágenes, fuentes y archivos públicos
├── scripts/
│   └── prerender.mjs            # Generación de HTML por ruta
├── src/
│   ├── components/              # Secciones y componentes reutilizables
│   ├── data/                    # Catálogos y configuración visible
│   ├── i18n/                    # Traducciones y estado de idioma
│   ├── seo/                     # Metadatos y datos estructurados
│   ├── App.jsx                  # Aplicación y navegación principal
│   ├── entry-server.jsx         # Entrada de renderizado en servidor
│   ├── index.css                # Estilos globales
│   └── main.jsx                 # Entrada e hidratación del cliente
├── .env.example
├── vercel.json                  # Redirecciones, cabeceras y caché
└── vite.config.js
```

## Requisitos

- Node.js `20.19` o superior, o `22.12` o superior, según los requisitos de Vite 8.
- npm.
- Una base PostgreSQL compatible con `DATABASE_URL` para utilizar los formularios.
- Una cuenta y una clave de Resend para enviar correos transaccionales.
- Un entorno compatible con las funciones de `api/`, como Vercel, para probar el flujo completo.

## Desarrollo local

Clona el repositorio, instala las versiones bloqueadas y ejecuta Vite:

```bash
git clone https://github.com/dhreian/dhreian-web.git
cd dhreian-web
npm ci
npm run dev
```

Este flujo inicia la interfaz local. El catálogo, los previews y la navegación funcionan sin
credenciales, pero los formularios y las descargas requieren las funciones serverless y sus
variables de entorno. Para probar la aplicación completa localmente, utiliza Vercel CLI con la
configuración descrita a continuación.

```bash
vercel dev
```

## Configuración del servidor

Copia `.env.example` como `.env.local` y completa los valores necesarios sin guardarlos en Git:

```env
DATABASE_URL=postgresql://usuario:clave@host/base?sslmode=require
RESEND_API_KEY=re_...
RATE_LIMIT_SECRET=una-clave-aleatoria-larga
PLUGIN_DOWNLOAD_SECRET=otra-clave-aleatoria-larga
DHREVERB_DOWNLOAD_URL=https://almacenamiento-privado.example/dhreverb-installer.exe
```

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión PostgreSQL para solicitudes, estados y límites de uso. |
| `RESEND_API_KEY` | Autorización para enviar confirmaciones y enlaces de descarga. |
| `RATE_LIMIT_SECRET` | Firma HMAC utilizada para anonimizar los identificadores de los límites de uso. |
| `PLUGIN_DOWNLOAD_SECRET` | Firma los enlaces temporales; si se omite, se utiliza `RATE_LIMIT_SECRET`. |
| `DHREVERB_DOWNLOAD_URL` | URL HTTPS privada desde la que el servidor obtiene el instalador. |

Las variables son exclusivas del servidor: no deben utilizar el prefijo `VITE_` ni exponerse en el
cliente. Las tablas se crean de forma idempotente al procesar la primera solicitud. El mismo
esquema está disponible en
[`database/001_contact_and_plugin_downloads.sql`](database/001_contact_and_plugin_downloads.sql).

## Despliegue en Vercel

1. Importa el repositorio en un proyecto de Vercel.
2. Configura las variables anteriores para los entornos que correspondan.
3. Verifica el dominio remitente utilizado por Resend.
4. Despliega el proyecto.

El comando de compilación genera los recursos de Vite y luego prerenderiza las rutas públicas.
`vercel.json` aplica las redirecciones canónicas, las cabeceras de seguridad y las políticas de
caché para recursos estáticos y endpoints.

## Scripts

| Comando | Función |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite. |
| `npm run build` | Compila la aplicación y prerenderiza las rutas indexables en `dist/`. |
| `npm run preview` | Sirve localmente la compilación de producción. |
| `npm run lint` | Ejecuta ESLint sobre el repositorio. |

Antes de entregar cambios, ejecuta:

```bash
npm run lint
npm run build
```

## Seguridad

- No guardes credenciales, URLs privadas ni instaladores en el repositorio.
- Utiliza secretos largos y distintos para los límites de uso y los enlaces de descarga.
- Mantén `DHREVERB_DOWNLOAD_URL` fuera del código y protégela en el proveedor de almacenamiento.
- Configura credenciales diferentes para desarrollo y producción.
- Reporta vulnerabilidades de forma privada según [`SECURITY.md`](SECURITY.md).

## Licencia

El código y los recursos originales están protegidos según la [licencia del proyecto](LICENSE). Las
fuentes y dependencias de terceros conservan sus propias licencias, documentadas en
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

## Contacto

- **Sitio:** [dhreian.com](https://dhreian.com).
- **Correo:** [contact@dhreian.com](mailto:contact@dhreian.com).
- **GitHub:** [github.com/dhreian](https://github.com/dhreian).
