export const SITE_URL = 'https://dhreian.com';

export const INDEXABLE_ROUTES = [
  '/',
  '/beats',
  '/servicios',
  '/plugins',
  '/herramientas',
  '/contacto',
];

export const ROUTE_ALIASES = {
  '/portfolio': '/',
  '/instrumentales': '/beats',
  '/services': '/servicios',
  '/tools': '/herramientas',
  '/contact': '/contacto',
};

const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const LOGO_IMAGE = `${SITE_URL}/icons/seo-organization-logo-512.png`;
const ARTIST_ID = `${SITE_URL}/#artist`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const PAGE_METADATA = {
  es: {
    '/': {
      title: 'dhreian | Artista · Productor · Desarrollador',
      name: 'dhreian — artista, productor musical y desarrollador',
      description:
        'dhreian — artista y productor musical. Beats exclusivos, producción full, mezcla, masterización profesional y plugins de audio para artistas independientes.',
      socialDescription:
        'Beats exclusivos, producción full, mezcla, masterización profesional y plugins de audio para artistas independientes.',
      imageAlt: 'dhreian — artista y productor musical',
      locale: 'es_CL',
    },
    '/beats': {
      title: 'Beats de Trap Exclusivos en BeatStars | dhreian',
      name: 'Beats de trap exclusivos de dhreian',
      description:
        'Compra beats de trap exclusivos de dhreian en BeatStars. Escucha previews, elige tu licencia MP3, WAV o Trackouts y descarga al instante.',
      socialDescription:
        'Escucha y compra beats de trap exclusivos de dhreian con licencias seguras en BeatStars.',
      imageAlt: 'dhreian — artista y productor musical',
      locale: 'es_CL',
    },
    '/servicios': {
      title: 'Producción Musical, Mezcla y Mastering | dhreian',
      name: 'Servicios de producción musical de dhreian',
      description:
        'Servicios de producción musical: beat custom, producción full, mezcla vocal e instrumental y masterización profesional para artistas.',
      socialDescription:
        'Beat custom, producción full, mezcla vocal e instrumental y masterización profesional con dhreian.',
      imageAlt: 'dhreian — artista y productor musical',
      locale: 'es_CL',
    },
    '/plugins': {
      title: 'Plugins de Audio VST3 Gratis para Windows | dhreian',
      name: 'Plugins de audio desarrollados por dhreian',
      description:
        'Descarga dhreVerb, plugin de reverb VST3 gratis para Windows desarrollado por dhreian: ligero en CPU, directo y con carácter.',
      socialDescription:
        'dhreVerb es un plugin de reverb VST3 gratis para Windows, creado por dhreian.',
      imageAlt: 'dhreian — artista y productor musical',
      locale: 'es_CL',
    },
    '/herramientas': {
      title: 'Herramientas de Audio para Productores y Streaming | dhreian',
      name: 'Herramientas de audio para productores de dhreian',
      description:
        'Usa auroLab para tareas de producción y descarga dhreLink gratis para enviar audio procesado desde tu DAW a OBS Studio en Windows.',
      socialDescription:
        'auroLab reúne utilidades de producción y dhreLink conecta el audio de tu DAW con OBS Studio sin dispositivos virtuales.',
      imageAlt: 'dhreian — artista y productor musical',
      locale: 'es_CL',
    },
    '/contacto': {
      title: 'Contacto | dhreian, Artista y Productor Musical',
      name: 'Contacto con dhreian',
      description:
        'Contacta a dhreian para cotizar beats custom, producción musical, mezcla, mastering, plugins o colaboraciones.',
      socialDescription:
        'Cotiza tu proyecto musical o colaboración directamente con dhreian.',
      imageAlt: 'dhreian — artista y productor musical',
      locale: 'es_CL',
    },
  },
  en: {
    '/': {
      title: 'dhreian | Artist · Producer · Developer',
      name: 'dhreian — artist, music producer and developer',
      description:
        'dhreian — artist and music producer. Exclusive beats, full production, professional mixing, mastering and audio plugins for independent artists.',
      socialDescription:
        'Exclusive beats, full production, professional mixing, mastering and audio plugins for independent artists.',
      imageAlt: 'dhreian — artist and music producer',
      locale: 'en_US',
    },
    '/beats': {
      title: 'Exclusive Trap Beats on BeatStars | dhreian',
      name: 'Exclusive trap beats by dhreian',
      description:
        'Buy exclusive trap beats by dhreian on BeatStars. Listen to previews, choose an MP3, WAV or Trackouts license and download instantly.',
      socialDescription:
        'Listen to and buy exclusive trap beats by dhreian with secure BeatStars licensing.',
      imageAlt: 'dhreian — artist and music producer',
      locale: 'en_US',
    },
    '/servicios': {
      title: 'Music Production, Mixing & Mastering | dhreian',
      name: 'Music production services by dhreian',
      description:
        'Music production services for artists: custom beats, full production, vocal and instrumental mixing, and professional mastering.',
      socialDescription:
        'Custom beats, full production, vocal and instrumental mixing, and professional mastering with dhreian.',
      imageAlt: 'dhreian — artist and music producer',
      locale: 'en_US',
    },
    '/plugins': {
      title: 'Free VST3 Audio Plugins for Windows | dhreian',
      name: 'Audio plugins developed by dhreian',
      description:
        'Download dhreVerb, a free VST3 reverb plugin for Windows by dhreian: light on CPU, straightforward and full of character.',
      socialDescription:
        'dhreVerb is a free VST3 reverb plugin for Windows, created by dhreian.',
      imageAlt: 'dhreian — artist and music producer',
      locale: 'en_US',
    },
    '/herramientas': {
      title: 'Audio Tools for Music Production and Streaming | dhreian',
      name: 'Audio tools for music producers by dhreian',
      description:
        'Use auroLab for production tasks and download dhreLink free to send processed audio from your DAW to OBS Studio on Windows.',
      socialDescription:
        'auroLab brings together production utilities, while dhreLink connects your DAW audio to OBS Studio without virtual devices.',
      imageAlt: 'dhreian — artist and music producer',
      locale: 'en_US',
    },
    '/contacto': {
      title: 'Contact | dhreian, Artist & Music Producer',
      name: 'Contact dhreian',
      description:
        'Contact dhreian to request custom beats, music production, mixing, mastering, plugins or collaborations.',
      socialDescription:
        'Request a music project or collaboration directly with dhreian.',
      imageAlt: 'dhreian — artist and music producer',
      locale: 'en_US',
    },
  },
};

const SECTION_COPY = {
  es: {
    home: 'Sitio oficial de dhreian: artista, productor musical y desarrollador.',
    beats: 'Elige tu beat y compra de forma segura a través de BeatStars. Checkout y descarga inmediatos.',
    services:
      'Lleva tu música al estándar más competitivo de las plataformas globales mediante un flujo de trabajo que respeta la esencia de tu sonido.',
    plugins:
      'Plugins creados con el mismo criterio con el que produzco: sonido con carácter y un flujo de trabajo directo, para que los uses en tus propias sesiones.',
    tools:
      'Recursos creados para resolver tareas técnicas de producción desde el navegador, con rapidez y sin interrumpir tu flujo creativo.',
    contact:
      '¿Listo para llevar tu proyecto al siguiente nivel? Escríbeme detallando tu visión y te responderé lo más rápido posible con una propuesta personalizada.',
  },
  en: {
    home: 'Official website of dhreian: artist, music producer and developer.',
    beats: 'Pick your beat and check out securely through BeatStars. Instant checkout and download.',
    services:
      'Take your music to the most competitive standard of global platforms through a workflow that respects the essence of your sound.',
    plugins:
      'Plugins built with the same approach I bring to production: sound with character and a straightforward workflow, ready to use in your own sessions.',
    tools:
      'Resources built to handle technical production tasks right in your browser, quickly and without interrupting your creative flow.',
    contact:
      "Ready to take your project to the next level? Write to me describing your vision and I'll get back to you as soon as possible with a tailored proposal.",
  },
};

const ROUTE_LABELS = {
  es: {
    '/beats': 'Beats',
    '/servicios': 'Servicios de producción',
    '/plugins': 'Plugins de audio',
    '/herramientas': 'Herramientas web',
    '/contacto': 'Contacto',
  },
  en: {
    '/beats': 'Beats',
    '/servicios': 'Production services',
    '/plugins': 'Audio plugins',
    '/herramientas': 'Web tools',
    '/contacto': 'Contact',
  },
};

const SOCIAL_PROFILES = [
  'https://instagram.com/dhreian',
  'https://x.com/dhreian',
  'https://tiktok.com/@dhreian_',
  'https://open.spotify.com/artist/5Sv40N0flsAfHMxy6NrB1m',
  'https://music.amazon.com/artists/B0GQXHF7ZR/dhreian',
  'https://www.youtube.com/@dhreian',
  'https://www.beatstars.com/dhreian',
];

const RELEASES = [
  {
    slug: 'calma',
    title: 'CALMA',
    artists: ['Nanae', 'Rayxn Antu'],
    image: '/collabs/art-calma.jpg',
    spotify: 'https://open.spotify.com/track/4mjzHteHfr9uHM9irpqhCl',
    apple: 'https://music.apple.com/cl/song/calma-feat-rayxn-antu/6794247468',
    youtube: 'https://youtu.be/xMQ4w3qaRGM',
  },
  {
    slug: 'artificial',
    title: 'artificial',
    artists: ['Nanae'],
    image: '/collabs/art-artificial.jpg',
    spotify: 'https://open.spotify.com/track/00r8HD5I5RfZLFKnJxbEBA',
    apple: 'https://music.apple.com/cl/album/artificial-single/6777309486',
    youtube: 'https://www.youtube.com/watch?v=x8dQBo_9qSE',
  },
  {
    slug: 'hilos-de-ternura',
    title: 'hilos de ternura',
    artists: ['Nanae'],
    image: '/collabs/art-hilos.webp',
    spotify: 'https://open.spotify.com/album/4AfGpUHkGgZY480WLuyJuF',
    apple: 'https://music.apple.com/cl/album/hilos-de-ternura-single/1820158756',
    youtube: 'https://www.youtube.com/watch?v=gt6iE5i3_sA',
  },
  {
    slug: 'amanecer-contigo',
    title: 'amanecer contigo',
    artists: ['Nanae'],
    image: '/collabs/art-amanecer.webp',
    spotify: 'https://open.spotify.com/album/2un8xEf4i9VxerTy2htgfg',
    apple: 'https://music.apple.com/cl/album/amanecer-contigo-single/1848530533',
    youtube: 'https://www.youtube.com/watch?v=MQzDMzxILUs',
  },
  {
    slug: 'senales',
    title: 'señales',
    artists: ['Nanae'],
    image: '/collabs/art-senales.webp',
    spotify: 'https://open.spotify.com/artist/5Sv40N0flsAfHMxy6NrB1m',
    apple: 'https://music.apple.com/cl/album/se%C3%B1ales-single/1853665206',
    youtube: 'https://www.youtube.com/watch?v=thlBdDLi92Q',
  },
];

const SERVICE_DATA = {
  es: [
    {
      name: 'Beat custom',
      description: 'Un beat exclusivo creado desde cero según tu visión, tus referencias y tu estilo.',
      minPrice: 150,
      maxPrice: 500,
    },
    {
      name: 'Producción full',
      description: 'El paquete completo para llevar tu tema de la idea al lanzamiento: beat, grabación y mezcla bajo una misma dirección artística.',
      minPrice: 200,
      maxPrice: 1000,
    },
    {
      name: 'Mezcla vocal e instrumental',
      description: 'Equilibrio perfecto de frecuencias, dinámica controlada y efectos para que tu voz se integre perfectamente con el beat.',
      minPrice: 50,
      maxPrice: 150,
    },
    {
      name: 'Masterización profesional',
      description: 'El toque final para que tu canción suene fuerte, clara y competitiva en todas las plataformas de streaming.',
      minPrice: 30,
      maxPrice: 100,
    },
  ],
  en: [
    {
      name: 'Custom beat',
      description: 'An exclusive beat created from scratch around your vision, your references and your style.',
      minPrice: 150,
      maxPrice: 500,
    },
    {
      name: 'Full production',
      description: 'The complete package to take your song from idea to release: beat, recording and mixing under one artistic direction.',
      minPrice: 200,
      maxPrice: 1000,
    },
    {
      name: 'Vocal and instrumental mixing',
      description: 'Perfect frequency balance, controlled dynamics and effects so your voice blends seamlessly with the beat.',
      minPrice: 50,
      maxPrice: 150,
    },
    {
      name: 'Professional mastering',
      description: 'The final touch to make your song sound loud, clear and competitive on every streaming platform.',
      minPrice: 30,
      maxPrice: 100,
    },
  ],
};

export function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return ROUTE_ALIASES[normalized] ?? normalized;
}

export function getPageMetadata(pathname = '/', lang = 'es') {
  const language = lang === 'en' ? 'en' : 'es';
  const path = normalizePath(pathname);
  const canonicalPath = INDEXABLE_ROUTES.includes(path) ? path : '/';
  const metadata = PAGE_METADATA[language][canonicalPath] ?? PAGE_METADATA[language]['/'];

  return {
    ...metadata,
    lang: language,
    path: canonicalPath,
    canonical: `${SITE_URL}${canonicalPath === '/' ? '/' : canonicalPath}`,
    image: DEFAULT_IMAGE,
    ogType: canonicalPath === '/' ? 'profile' : 'website',
  };
}

function createArtistNode(lang) {
  const isEnglish = lang === 'en';

  return {
    '@type': 'Person',
    '@id': ARTIST_ID,
    name: 'dhreian',
    alternateName: ['@dhreian', 'dhreian music'],
    description: isEnglish
      ? 'Artist, music producer and developer creating exclusive beats, professional production, mixing, mastering, audio plugins and web tools.'
      : 'Artista, productor musical y desarrollador de beats exclusivos, producción profesional, mezcla, masterización, plugins de audio y herramientas web.',
    url: `${SITE_URL}/`,
    mainEntityOfPage: { '@id': `${SITE_URL}/#webpage` },
    image: DEFAULT_IMAGE,
    logo: LOGO_IMAGE,
    email: 'contact@dhreian.com',
    jobTitle: isEnglish
      ? ['Artist', 'Music producer', 'Mixing and mastering engineer', 'Developer']
      : ['Artista', 'Productor musical', 'Ingeniero de mezcla y mastering', 'Desarrollador'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@dhreian.com',
      contactType: 'customer support',
      availableLanguage: ['Spanish', 'English'],
    },
    sameAs: SOCIAL_PROFILES,
    knowsAbout: isEnglish
      ? ['music production', 'exclusive beats', 'vocal mixing', 'mastering', 'audio plugins', 'music production web tools']
      : ['producción musical', 'beats exclusivos', 'mezcla vocal', 'masterización', 'plugins de audio', 'herramientas web para producción musical'],
  };
}

function createWebsiteNode(lang) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: 'dhreian',
    alternateName: ['dhreian music', 'dhreian — Artista y Productor Musical'],
    description: SECTION_COPY[lang].home,
    inLanguage: ['es', 'en'],
    publisher: { '@id': ARTIST_ID },
    copyrightHolder: { '@id': ARTIST_ID },
    copyrightYear: 2026,
  };
}

function createBreadcrumbNode(path, lang, pageUrl) {
  if (path === '/') return null;

  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'dhreian',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: ROUTE_LABELS[lang][path],
        item: pageUrl,
      },
    ],
  };
}

function createPageNode(metadata) {
  const pageTypes = {
    '/': 'ProfilePage',
    '/beats': 'CollectionPage',
    '/servicios': 'WebPage',
    '/plugins': 'CollectionPage',
    '/herramientas': 'CollectionPage',
    '/contacto': 'ContactPage',
  };
  const mainEntityIds = {
    '/': ARTIST_ID,
    '/beats': `${SITE_URL}/beats#catalog`,
    '/servicios': `${SITE_URL}/servicios#services`,
    '/plugins': `${SITE_URL}/plugins#dhreverb`,
    '/herramientas': `${SITE_URL}/herramientas#catalog`,
    '/contacto': ARTIST_ID,
  };

  return {
    '@type': pageTypes[metadata.path],
    '@id': `${metadata.canonical}#webpage`,
    url: metadata.canonical,
    name: metadata.name,
    description: metadata.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ARTIST_ID },
    mainEntity: { '@id': mainEntityIds[metadata.path] },
    primaryImageOfPage: DEFAULT_IMAGE,
    inLanguage: metadata.lang,
    ...(metadata.path === '/'
      ? {
          hasPart: RELEASES.map((release) => ({
            '@id': `${SITE_URL}/#track-${release.slug}`,
          })),
        }
      : {}),
    ...(metadata.path !== '/'
      ? { breadcrumb: { '@id': `${metadata.canonical}#breadcrumb` } }
      : {}),
  };
}

function createServiceCatalog(lang) {
  return {
    '@type': 'OfferCatalog',
    '@id': `${SITE_URL}/servicios#services`,
    name: lang === 'en' ? 'Music production services by dhreian' : 'Servicios de producción musical de dhreian',
    description: SECTION_COPY[lang].services,
    url: `${SITE_URL}/servicios`,
    itemListElement: SERVICE_DATA[lang].map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: { '@id': ARTIST_ID },
        areaServed: 'Worldwide',
      },
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD',
        price: `${service.minPrice} – ${service.maxPrice}`,
      },
    })),
  };
}

function createBeatCatalog(lang) {
  const beat = {
    '@type': ['Product', 'MusicRecording'],
    '@id': `${SITE_URL}/beats#vibras`,
    name: 'vibras',
    image: `${SITE_URL}/beats/vibras.png`,
    genre: 'trap',
    byArtist: { '@id': ARTIST_ID },
    url: `${SITE_URL}/beats`,
    associatedMedia: {
      '@type': 'AudioObject',
      contentUrl: `${SITE_URL}/beats/vibras.mp3`,
      encodingFormat: 'audio/mpeg',
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'BPM', value: 160 },
      { '@type': 'PropertyValue', name: lang === 'en' ? 'Key' : 'Tonalidad', value: 'G major' },
    ],
    offers: {
      '@type': 'Offer',
      url: 'https://www.beatstars.com/beat/vibras-25824399',
      price: 29.99,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: { '@id': ARTIST_ID },
    },
  };

  return [
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/beats#catalog`,
      name: lang === 'en' ? 'Exclusive beats by dhreian' : 'Catálogo de beats exclusivos de dhreian',
      description: SECTION_COPY[lang].beats,
      url: `${SITE_URL}/beats`,
      numberOfItems: 1,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: { '@id': beat['@id'] },
        },
      ],
    },
    beat,
  ];
}

function createPluginNode(lang) {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/plugins#dhreverb`,
    name: 'dhreVerb',
    description:
      lang === 'en'
        ? 'A reverb with character: dense, modulated spaces that settle into the mix without clouding it. Light on CPU and straightforward to use.'
        : 'Una reverb con carácter: espacios densos y modulados que se asientan en la mezcla sin ensuciarla. Ligera en CPU y directa de usar.',
    applicationCategory: 'MultimediaApplication',
    applicationSubCategory: 'Audio plugin (VST3)',
    operatingSystem: 'Windows',
    softwareVersion: '1.0.0',
    url: `${SITE_URL}/plugins`,
    image: `${SITE_URL}/plugins/dhreverb.png`,
    author: { '@id': ARTIST_ID },
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };
}

function createWebToolNodes(lang) {
  const auroLab = {
    '@type': 'WebApplication',
    '@id': `${SITE_URL}/herramientas#aurolab`,
    name: 'auroLab',
    description:
      lang === 'en'
        ? 'A web lab for producers, built to calculate delay and reverb timing from BPM, practice with a metronome and tap tempo, and analyze the BPM and key of your audio without leaving the browser.'
        : 'Un laboratorio web para productores, creado para calcular tiempos de delay y reverb a partir del BPM, practicar con metrónomo y tap tempo, y analizar el BPM y la tonalidad de tus audios sin salir del navegador.',
    applicationCategory: 'MultimediaApplication',
    browserRequirements: 'Requires JavaScript and a modern web browser',
    operatingSystem: 'Any',
    url: 'https://aurolab.dhreian.com/',
    image: `${SITE_URL}/tools/aurolab.png`,
    author: { '@id': ARTIST_ID },
  };

  const dhreLink = {
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/herramientas#dhrelink`,
    name: 'dhreLink',
    description:
      lang === 'en'
        ? 'Send processed audio from your DAW to OBS Studio on Windows through a VST3 and an OBS source, with no virtual audio devices or helper applications.'
        : 'Lleva el audio ya procesado de tu DAW a OBS Studio en Windows mediante un VST3 y una fuente de OBS, sin dispositivos de audio virtuales ni aplicaciones auxiliares.',
    applicationCategory: 'MultimediaApplication',
    applicationSubCategory: 'Audio routing tool (VST3 and OBS source)',
    operatingSystem: 'Windows 10/11 x64',
    softwareVersion: '1.0.0',
    url: `${SITE_URL}/herramientas`,
    image: `${SITE_URL}/tools/dhrelink.png`,
    author: { '@id': ARTIST_ID },
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  return [
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/herramientas#catalog`,
      name: lang === 'en' ? 'Audio tools by dhreian' : 'Herramientas de audio de dhreian',
      url: `${SITE_URL}/herramientas`,
      numberOfItems: 2,
      itemListElement: [auroLab, dhreLink].map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: { '@id': tool['@id'] },
      })),
    },
    auroLab,
    dhreLink,
  ];
}

function createReleaseNodes() {
  return RELEASES.map((release) => {
    const platformUrls = [release.spotify, release.apple, release.youtube];
    const recordingUrls = platformUrls.filter(
      (url) => !url.includes('open.spotify.com/artist/')
    );
    const primaryUrl = release.spotify.includes('open.spotify.com/track/')
      ? release.spotify
      : release.youtube;

    return {
      '@type': 'MusicRecording',
      '@id': `${SITE_URL}/#track-${release.slug}`,
      name: release.title,
      byArtist: [
        { '@id': ARTIST_ID },
        ...release.artists.map((artist) => ({ '@type': 'MusicGroup', name: artist })),
      ],
      image: `${SITE_URL}${release.image}`,
      url: primaryUrl,
      sameAs: recordingUrls,
    };
  });
}

export function getStructuredData(pathname = '/', lang = 'es') {
  const metadata = getPageMetadata(pathname, lang);
  const graph = [
    createWebsiteNode(metadata.lang),
    createArtistNode(metadata.lang),
    createPageNode(metadata),
  ];
  const breadcrumb = createBreadcrumbNode(metadata.path, metadata.lang, metadata.canonical);

  if (breadcrumb) graph.push(breadcrumb);

  if (metadata.path === '/' || metadata.path === '/beats') {
    graph.push(...createBeatCatalog(metadata.lang));
  }
  if (metadata.path === '/' || metadata.path === '/servicios') {
    graph.push(createServiceCatalog(metadata.lang));
  }
  if (metadata.path === '/' || metadata.path === '/plugins') {
    graph.push(createPluginNode(metadata.lang));
  }
  if (metadata.path === '/' || metadata.path === '/herramientas') {
    graph.push(...createWebToolNodes(metadata.lang));
  }
  if (metadata.path === '/') {
    graph.push(...createReleaseNodes());
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

function setMeta(selector, content) {
  const element = document.head.querySelector(selector);
  if (element && content) element.setAttribute('content', content);
}

function setLink(selector, href) {
  const element = document.head.querySelector(selector);
  if (element && href) element.setAttribute('href', href);
}

export function applyPageMetadata(pathname = '/', lang = 'es') {
  if (typeof document === 'undefined') return;

  const metadata = getPageMetadata(pathname, lang);
  document.documentElement.lang = metadata.lang;
  document.title = metadata.title;

  setMeta('meta[name="description"]', metadata.description);
  setMeta('meta[property="og:type"]', metadata.ogType);
  setMeta('meta[property="og:title"]', metadata.title);
  setMeta('meta[property="og:description"]', metadata.socialDescription);
  setMeta('meta[property="og:url"]', metadata.canonical);
  setMeta('meta[property="og:image"]', metadata.image);
  setMeta('meta[property="og:image:secure_url"]', metadata.image);
  setMeta('meta[property="og:image:alt"]', metadata.imageAlt);
  setMeta('meta[property="og:locale"]', metadata.locale);
  setMeta('meta[name="twitter:title"]', metadata.title);
  setMeta('meta[name="twitter:description"]', metadata.socialDescription);
  setMeta('meta[name="twitter:image"]', metadata.image);
  setMeta('meta[name="twitter:image:alt"]', metadata.imageAlt);

  setLink('link[rel="canonical"]', metadata.canonical);
  setLink('link[rel="alternate"][hreflang="es"]', metadata.canonical);
  setLink('link[rel="alternate"][hreflang="x-default"]', metadata.canonical);

  const structuredData = document.getElementById('structured-data');
  if (structuredData) {
    structuredData.textContent = JSON.stringify(getStructuredData(metadata.path, metadata.lang));
  }
}
