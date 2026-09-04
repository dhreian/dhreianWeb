import {
  faSliders,
  faWaveSquare,
  faMusic,
  faStar,
  faDrum,
  faHeadphones,
  faMicrophoneLines,
} from '@fortawesome/free-solid-svg-icons';
import {
  faSpotify,
  faApple,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

export const NAV_LINKS = [
  { key: 'beats', href: '/beats', sectionId: 'beats' },
  { key: 'services', href: '/servicios', sectionId: 'servicios' },
  { key: 'plugins', href: '/plugins', sectionId: 'plugins' },
  { key: 'webtools', href: '/herramientas', sectionId: 'herramientas' },
  { key: 'contact', href: '/contacto', sectionId: 'contacto' },
];

export const SECTION_ROUTES = {
  '/': null,
  '/portfolio': 'portfolio',
  '/beats': 'beats',
  '/instrumentales': 'beats',
  '/servicios': 'servicios',
  '/services': 'servicios',
  '/plugins': 'plugins',
  '/herramientas': 'herramientas',
  '/tools': 'herramientas',
  '/contacto': 'contacto',
  '/contact': 'contacto',
};

export const SOCIAL_LINKS = [
  { platform: 'instagram', href: 'https://instagram.com/dhreian', label: 'Instagram', hoverClass: 'hover:text-[#E1306C] hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10 hover:shadow-[0_0_15px_rgba(225,48,108,0.4)]' },
  { platform: 'x', href: 'https://x.com/dhreian', label: 'X (Twitter)', hoverClass: 'hover:text-[#FFFFFF] hover:border-[#FFFFFF]/50 hover:bg-[#FFFFFF]/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]' },
  { platform: 'tiktok', href: 'https://tiktok.com/@dhreian_', label: 'TikTok', hoverClass: 'hover:text-[#00F2FE] hover:border-[#00F2FE]/50 hover:bg-[#00F2FE]/10 hover:shadow-[0_0_15px_rgba(0,242,254,0.4)]' },
  { platform: 'spotify', href: 'https://open.spotify.com/intl-es/artist/5Sv40N0flsAfHMxy6NrB1m', label: 'Spotify', hoverClass: 'hover:text-[#1DB954] hover:border-[#1DB954]/50 hover:bg-[#1DB954]/10 hover:shadow-[0_0_15px_rgba(29,185,84,0.4)]' },
  { platform: 'youtube', href: 'https://www.youtube.com/@dhreian', label: 'YouTube', hoverClass: 'hover:text-[#FF0000] hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10 hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]' },
];

export const BEATS = [
  {
    slug: 'vibras',
    title: 'vibras',
    cover: '/beats/vibras.png',
    preview: '/beats/vibras.mp3',
    beatstarsUrl: 'https://www.beatstars.com/beat/vibras-25824399',
    bpm: 160,
    musicalKey: 'G major',
    genres: ['trap'],
    price: '$29.99',
  },
];

export const SERVICES = [
  { key: 'beatcustom', icon: faDrum, price: '$150 – $500 USD' },
  { key: 'fullprod', icon: faMicrophoneLines, price: '$200 – $1000 USD' },
  { key: 'mixing', icon: faSliders, price: '$50 – $150 USD' },
  { key: 'mastering', icon: faWaveSquare, price: '$30 – $100 USD' },
];

export const PLUGINS = [
  {
    key: 'dhreverb',
    name: 'dhreVerb',
    type: 'reverb',
    image: '/plugins/dhreverb.png',
    formats: ['VST3', 'Windows'],
    free: true,
    price: null,
    url: null,
    downloadByEmail: true,
    comingSoon: false,
  },
];

export const WEB_TOOLS = [
  {
    key: 'aurolab',
    name: 'auroLab',
    image: '/tools/aurolab.png',
    type: 'webApp',
    url: 'https://aurolab.dhreian.com',
  },
  {
    key: 'dhrelink',
    name: 'dhreLink',
    image: '/tools/dhrelink.png',
    type: 'desktopApp',
    formats: ['VST3', 'OBS', 'Windows'],
    free: true,
    downloadByEmail: true,
    url: null,
  },
];

export const TRACKS = [
  {
    title: 'CALMA',
    mainArtist: 'dhreian & Nanae',
    featArtist: 'Rayxn Antu',
    tags: ['prod'],
    cover: '/collabs/art-calma.jpg',
    links: {
      spotify: 'https://open.spotify.com/intl-es/track/4mjzHteHfr9uHM9irpqhCl',
      apple: 'https://music.apple.com/cl/song/calma-feat-rayxn-antu/6794247468',
      youtube: 'https://youtu.be/xMQ4w3qaRGM',
    }
  },
  {
    title: 'artificial',
    mainArtist: 'dhreian & nanae',
    featArtist: null,
    tags: ['prod'],
    cover: '/collabs/art-artificial.jpg',
    links: {
      spotify: 'https://open.spotify.com/intl-es/track/00r8HD5I5RfZLFKnJxbEBA',
      apple: 'https://music.apple.com/cl/album/artificial-single/6777309486',
      youtube: 'https://www.youtube.com/watch?v=x8dQBo_9qSE',
    }
  },
  {
    title: 'hilos de ternura',
    mainArtist: 'dhreian & nanae',
    featArtist: null,
    tags: ['prod'],
    cover: '/collabs/art-hilos.webp',
    links: {
      spotify: 'https://open.spotify.com/intl-es/album/4AfGpUHkGgZY480WLuyJuF',
      apple: 'https://music.apple.com/cl/album/hilos-de-ternura-single/1820158756',
      youtube: 'https://www.youtube.com/watch?v=gt6iE5i3_sA',
    }
  },
  {
    title: 'amanecer contigo',
    mainArtist: 'dhreian & nanae',
    featArtist: null,
    tags: ['prod'],
    cover: '/collabs/art-amanecer.webp',
    links: {
      spotify: 'https://open.spotify.com/intl-es/album/2un8xEf4i9VxerTy2htgfg',
      apple: 'https://music.apple.com/cl/album/amanecer-contigo-single/1848530533',
      youtube: 'https://www.youtube.com/watch?v=MQzDMzxILUs',
    }
  },
  {
    title: 'señales',
    mainArtist: 'dhreian & nanae',
    featArtist: null,
    tags: ['prod'],
    cover: '/collabs/art-senales.webp',
    links: {
      spotify: 'https://open.spotify.com/intl-es/artist/5Sv40N0flsAfHMxy6NrB1m',
      apple: 'https://music.apple.com/cl/album/se%C3%B1ales-single/1853665206',
      youtube: 'https://www.youtube.com/watch?v=thlBdDLi92Q',
    }
  },
];

export const TRACK_TAG_ICONS = {
  prod: faHeadphones,
  beatmaker: faDrum,
  mezcla: faSliders,
  mastering: faWaveSquare,
};

export const TRACK_TAG_STYLES = {
  prod: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
  beatmaker: 'bg-purple-950/70 text-purple-300 border-purple-500/30',
  mezcla: 'bg-white/10 text-white border-white/20',
  mastering: 'bg-purple-600/25 text-purple-100 border-purple-300/40',
};

export const PLATFORMS = [
  { key: 'spotify', icon: faSpotify, brandColor: '#1DB954', hoverClass: 'hover:text-[#1DB954] hover:border-[#1DB954]/50 hover:bg-[#1DB954]/10 hover:shadow-[0_0_15px_rgba(29,185,84,0.4)]', title: 'Spotify' },
  { key: 'apple', icon: faApple, brandColor: '#FA243C', hoverClass: 'hover:text-[#FA243C] hover:border-[#FA243C]/50 hover:bg-[#FA243C]/10 hover:shadow-[0_0_15px_rgba(250,36,60,0.4)]', title: 'Apple Music' },
  { key: 'youtube', icon: faYoutube, brandColor: '#FF0000', hoverClass: 'hover:text-[#FF0000] hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10 hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]', title: 'YouTube' },
];

export { faStar, faMusic };
