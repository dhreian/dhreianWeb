import React from 'react';

const ACCENTS = {
  purple: {
    border: 'border-purple-500',
  },
  subtle: {
    border: 'border-purple-500',
  },
};

export default function NeonCard({
  accent = 'subtle',
  interactive = true,
  children,
  className = '',
}) {
  const a = ACCENTS[accent] || ACCENTS.subtle;
  const interaction = interactive ? 'transition-colors duration-300' : '';

  return (
    <div
      className={`liquid-glass-card group relative overflow-hidden border ${a.border} rounded-2xl ${interaction} ${className}`}
    >
      <div className="h-full">{children}</div>
    </div>
  );
}
