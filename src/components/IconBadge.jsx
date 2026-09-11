import React from 'react';
import GothicIcon from './GothicIcon';

const VARIANTS = {
  purple: 'metallic-purple-badge border',
  zinc: 'metallic-control text-zinc-700 border group-hover:border-purple-500 group-hover:text-purple-500',
  glow: 'metallic-purple-badge border',
};

const SIZES = {
  sm: { box: 'w-10 h-10', iconSize: 'control' },
  md: { box: 'w-14 h-14', iconSize: 'badge' },
  lg: { box: 'w-16 h-16', iconSize: 'platform-featured' },
};

export default function IconBadge({
  icon,
  variant = 'purple',
  size = 'md',
  shape = 'square',
  className = '',
}) {
  const s = SIZES[size];
  const radius = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';
  const variantClass = VARIANTS[variant] || VARIANTS.purple;

  return (
    <div
      className={`shrink-0 grid place-items-center transition-all duration-300 ${s.box} ${radius} ${variantClass} ${className}`}
    >
      <GothicIcon icon={icon} size={s.iconSize} />
    </div>
  );
}
