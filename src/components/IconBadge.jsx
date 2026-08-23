import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VARIANTS = {
  purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 group-hover:border-purple-400/40',
  fuchsia: 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 group-hover:bg-fuchsia-500/20 group-hover:border-fuchsia-400/40',
  zinc: 'bg-zinc-800/50 text-zinc-300 border border-white/5 group-hover:bg-purple-500/10 group-hover:text-purple-400 group-hover:border-purple-500/30',
  glow: 'bg-purple-500/10 text-purple-300 border border-purple-500/30 neon-glow-purple',
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

  return (
    <div
      className={`shrink-0 grid place-items-center transition-all duration-300 ${s.box} ${radius} ${VARIANTS[variant]} ${className}`}
    >
      <FontAwesomeIcon icon={icon} fixedWidth className={s.icon} />
    </div>
  );
}
