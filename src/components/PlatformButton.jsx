import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PlatformButton({ icon, brandColor, href, title }) {
  return (
    <a
      href={href}
      title={title}
      aria-label={title}
      className="relative w-10 h-10 rounded-full bg-zinc-800/70 border border-white/5 grid place-items-center transition-all duration-300 group hover:scale-110 hover:border-white/20"
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = brandColor;
        e.currentTarget.style.boxShadow = `0 0 18px ${brandColor}80, 0 0 35px ${brandColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <FontAwesomeIcon icon={icon} fixedWidth className="text-white text-base transition-transform duration-300 group-hover:scale-110" />
    </a>
  );
}
