import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faXTwitter,
  faTiktok,
  faSpotify,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { SOCIAL_LINKS } from '../data/site';

const SOCIAL_ICONS = {
  instagram: faInstagram,
  x: faXTwitter,
  tiktok: faTiktok,
  spotify: faSpotify,
  youtube: faYoutube,
};

export default function Footer() {
  return (
    <footer className="relative border-t border-purple-500/10 py-12 text-center bg-black overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-purple-600/10 blur-[80px] pointer-events-none"></div>

      <div className="relative z-10">
        <p className="font-display lowercase text-4xl text-white mb-6 neon-text-purple">
          dhreian
        </p>

        <div className="flex justify-center gap-4 mb-6">
          {SOCIAL_LINKS.map(({ platform, href, label, hoverClass }) => {
            const icon = SOCIAL_ICONS[platform];
            if (!icon) return null;
            return (
              <a
                key={platform}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`w-10 h-10 rounded-full border border-white/10 text-zinc-400 transition-all duration-300 grid place-items-center ${hoverClass || 'hover:text-purple-300 hover:border-purple-400/50 hover:bg-purple-500/10 hover:neon-glow-purple'}`}
              >
                <FontAwesomeIcon icon={icon} fixedWidth />
              </a>
            );
          })}
        </div>

        <a
          href="mailto:contact@dhreian.com"
          className="font-body text-zinc-400 hover:text-purple-300 transition-colors duration-300 text-sm tracking-wide"
        >
          contact@dhreian.com
        </a>

        <p className="text-zinc-600 text-sm mt-6">
          &copy; {new Date().getFullYear()} dhreian.
        </p>
      </div>
    </footer>
  );
}
