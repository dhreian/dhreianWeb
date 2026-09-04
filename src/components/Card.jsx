import React from 'react';

const ACCENTS = {
  purple: {
    border: 'border-purple-500/30 hover:border-purple-400/70',
    shadow: 'hover:neon-shadow-card-purple',
    blur: 'bg-purple-500/15 group-hover:bg-purple-500/30',
  },
  subtle: {
    border: 'border-white/5 hover:border-purple-500/40',
    shadow: 'hover:neon-shadow-card-subtle',
    blur: 'bg-purple-500/5 group-hover:bg-purple-500/15',
  },
};

export default function NeonCard({
  accent = 'subtle',
  interactive = true,
  children,
  className = '',
}) {
  const a = ACCENTS[accent] || ACCENTS.subtle;
  const lift = '';
  const hoverShadow = interactive ? a.shadow : '';

  return (
    <div
      className={`group relative overflow-hidden bg-zinc-950/70 border ${a.border} rounded-2xl transform-gpu transition-all duration-500 ${lift} ${hoverShadow} ${className}`}
    >
      <div
        className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl transition-all duration-500 pointer-events-none ${a.blur}`}
      ></div>

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      ></div>

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
