import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import {
  faInstagram,
  faXTwitter,
  faTiktok,
  faSpotify,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { NAV_LINKS, SOCIAL_LINKS } from '../data/site';
import { useLang } from '../i18n/LanguageContext';

const SOCIAL_ICONS = {
  instagram: faInstagram,
  x: faXTwitter,
  tiktok: faTiktok,
  spotify: faSpotify,
  youtube: faYoutube,
};

const SOCIAL_HOVER = {
  instagram: 'hover:text-[#E1306C]',
  x: 'hover:text-white',
  tiktok: 'hover:text-[#00F2FE]',
  spotify: 'hover:text-[#1DB954]',
  youtube: 'hover:text-[#FF0000]',
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { t, lang, toggleLang } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 border rounded-2xl flex justify-between items-center gap-3 lg:gap-6 transition-all duration-500 w-[95%] md:w-max max-w-4xl px-4 lg:px-6 py-3 ${
        scrolled
          ? 'bg-black/90 border-purple-500/20 shadow-[0_0_30px_rgba(138,108,255,0.25)]'
          : 'bg-black/75 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]'
      }`}
    >
      <a
        href="/"
        className="font-display lowercase text-xl text-purple-400 font-bold tracking-wider neon-text-purple shrink-0"
      >
        dhreian
      </a>

      <div className="hidden md:flex gap-3 lg:gap-6 items-center">
        {NAV_LINKS.map(({ key, href }) => (
          <a
            key={key}
            href={href}
            className="relative font-display lowercase text-zinc-300 hover:text-white transition-colors duration-300 group whitespace-nowrap"
          >
            {t(`nav.${key}`)}
            <span className="absolute left-0 -bottom-1 w-0 h-px bg-gradient-to-r from-purple-400 to-fuchsia-400 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(138,108,255,0.8)]"></span>
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3 lg:gap-4 shrink-0">
        <span className="hidden md:block w-px h-4 bg-white/15"></span>

        <div className="flex gap-3 lg:gap-4 items-center">
          {SOCIAL_LINKS.map(({ platform, href, label }) => {
            const icon = SOCIAL_ICONS[platform];
            if (!icon) return null;
            return (
              <a
                key={platform}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`text-zinc-400 hover:scale-110 transition-all duration-300 ${SOCIAL_HOVER[platform] || 'hover:text-purple-300'}`}
              >
                <FontAwesomeIcon icon={icon} fixedWidth className="text-base" />
              </a>
            );
          })}
        </div>

        <span className="w-px h-4 bg-white/15"></span>

        <button
          type="button"
          onClick={toggleLang}
          aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}
          className="flex items-center gap-1.5 rounded-2xl border border-white/10 px-3 py-1.5 text-zinc-300 hover:text-purple-300 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 cursor-pointer shrink-0"
        >
          <span className="font-body text-xs font-semibold tracking-wider">
            {lang === 'es' ? 'EN' : 'ES'}
          </span>
          <FontAwesomeIcon icon={faGlobe} className="text-xs" />
        </button>
      </div>
    </nav>
  );
}
