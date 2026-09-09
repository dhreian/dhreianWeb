import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PlatformButton({ icon, brandColor, href, title }) {
  return (
    <a
      href={href}
      title={title}
      aria-label={title}
      className="liquid-glass-button group relative grid h-10 w-10 place-items-center rounded-full border border-zinc-700 bg-zinc-900 transition-colors duration-300 hover:border-white"
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = brandColor;
        e.currentTarget.style.boxShadow = `0 0 18px ${brandColor}80, 0 0 35px ${brandColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <FontAwesomeIcon icon={icon} fixedWidth className="text-white text-base" />
    </a>
  );
}
