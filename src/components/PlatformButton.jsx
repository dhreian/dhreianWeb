import React from 'react';
import GothicIcon from './GothicIcon';

export default function PlatformButton({ icon, href, title, platform }) {
  return (
    <a
      href={href}
      title={title}
      aria-label={title}
      data-platform={platform}
      className="platform-metallic-button liquid-glass-button group relative grid h-10 w-10 place-items-center rounded-full border transition-all duration-300"
    >
      <GothicIcon icon={icon} size="platform" className="text-white" />
    </a>
  );
}
