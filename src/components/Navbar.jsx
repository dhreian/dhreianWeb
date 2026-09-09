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
  x: 'hover:text-zinc-950',
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
      className={`liquid-glass-card fixed top-6 left-1/2 -translate-x-1/2 z-50 border rounded-2xl flex items-center [--nav-space:clamp(0.5rem,1.2vw,1rem)] gap-[var(--nav-space)] transition-all duration-500 w-fit max-w-[95vw] px-[var(--nav-space)] py-3 ${
        scrolled
          ? 'liquid-glass-nav--scrolled border-purple-500'
          : 'border-zinc-300'
      }`}
    >
      <a
        href="/"
        className="font-display lowercase text-card-compact tracking-tight text-purple-800 shrink-0"
      >
        dhreian
      </a>

      <div className="hidden md:contents">
        {NAV_LINKS.map(({ key, href }) => (
          <a
            key={key}
            href={href}
            className="relative font-display text-nav lowercase tracking-wide text-black hover:text-purple-900 transition-colors duration-300 group whitespace-nowrap"
          >
            {t(`nav.${key}`)}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
        ))}
      </div>

      <span
        aria-hidden="true"
        className="hidden h-5 w-px shrink-0 bg-black md:block"
      />

      <div className="contents">
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
              className={`shrink-0 text-black transition-colors duration-300 ${SOCIAL_HOVER[platform] || 'hover:text-purple-800'}`}
            >
              <FontAwesomeIcon icon={icon} fixedWidth className="text-base" />
            </a>
          );
        })}
      </div>

      <button
        type="button"
        onClick={toggleLang}
        aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}
        className="liquid-glass-button flex shrink-0 cursor-pointer items-center gap-1.5 rounded-2xl border border-black bg-black px-3 py-1.5 text-white transition-colors duration-300 hover:border-purple-500 hover:bg-purple-500 hover:text-white"
      >
        <span className="font-body text-meta font-semibold tracking-wider">
          {lang === 'es' ? 'EN' : 'ES'}
        </span>
        <FontAwesomeIcon icon={faGlobe} className="text-xs" />
      </button>
    </nav>
  );
}
