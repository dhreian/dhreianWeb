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
    <footer className="relative overflow-hidden bg-black py-12 text-center">
      <div className="metallic-divider-horizontal absolute inset-x-0 top-0 w-full"></div>

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
                data-social={platform}
                className={`social-metallic-button metallic-dark-control liquid-glass-button grid h-10 w-10 place-items-center rounded-full border text-zinc-300 transition-all duration-300 ${hoverClass || ''}`}
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
