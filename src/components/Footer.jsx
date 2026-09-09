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
    <footer className="relative overflow-hidden border-t border-purple-500 bg-black py-12 text-center">
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-purple-500"></div>

      <div className="relative z-10">
        <p className="mb-6 font-display text-section lowercase text-white">
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
                className={`liquid-glass-button grid h-10 w-10 place-items-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 transition-colors duration-300 ${hoverClass || 'hover:border-purple-500 hover:text-purple-500'}`}
              >
                <FontAwesomeIcon icon={icon} fixedWidth />
              </a>
            );
          })}
        </div>

        <a
          href="mailto:contact@dhreian.com"
          className="font-body text-zinc-400 hover:text-purple-300 transition-colors duration-300 text-body-compact tracking-wide"
        >
          contact@dhreian.com
        </a>

        <p className="text-zinc-600 text-meta mt-6">
          &copy; {new Date().getFullYear()} dhreian.
        </p>
      </div>
    </footer>
  );
}
