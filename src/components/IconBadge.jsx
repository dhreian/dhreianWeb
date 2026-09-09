import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VARIANTS = {
  purple: 'bg-purple-500 text-white border border-purple-500',
  zinc: 'bg-zinc-100 text-zinc-700 border border-zinc-300 group-hover:border-purple-500 group-hover:text-purple-500',
  glow: 'bg-purple-500 text-white border border-purple-500',
};

const SIZES = {
  sm: { box: 'w-10 h-10', icon: 'text-sm' },
  md: { box: 'w-14 h-14', icon: 'text-xl' },
  lg: { box: 'w-16 h-16', icon: 'text-2xl' },
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
      <FontAwesomeIcon icon={icon} fixedWidth className={s.icon} />
    </div>
  );
}
