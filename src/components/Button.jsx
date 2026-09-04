import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VARIANTS = {
  primary:
    "bg-purple-600 text-white hover:bg-purple-500 hover:neon-glow-purple",
  outline:
    "bg-transparent border border-purple-500/50 text-white hover:border-purple-400 hover:bg-purple-900/20 shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:neon-glow-purple",
  ghost:
    "bg-transparent text-purple-300 hover:text-white hover:bg-white/5",
  light:
    "bg-white text-black hover:bg-purple-400 hover:text-white shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:neon-glow-purple-strong",
};

const SIZES = {
  sm: "px-5 py-2.5 text-base",
  md: "px-7 py-3.5 text-xl",
  lg: "px-9 py-4 text-2xl",
};

export default function NeonButton({
  as: Component = 'a',
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-3 rounded-2xl font-display lowercase tracking-wide transition-all duration-300 group cursor-pointer select-none";

  return (
    <Component
      className={`${base} ${SIZES[size]} ${VARIANTS[variant] || VARIANTS.primary} ${className}`}
      {...rest}
    >
      <span>{children}</span>
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className="w-4 h-4"
        />
      )}
    </Component>
  );
}
