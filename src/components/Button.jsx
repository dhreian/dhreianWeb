import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VARIANTS = {
  primary:
    "bg-purple-600 text-white hover:bg-purple-500 hover:neon-glow-purple",
  outline:
    "bg-transparent border border-purple-500/50 text-white hover:border-purple-400 hover:bg-purple-900/20 shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:neon-glow-purple",
  outlineFuchsia:
    "bg-transparent border border-fuchsia-500/50 text-white hover:border-fuchsia-400 hover:bg-fuchsia-900/20 shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:neon-glow-fuchsia",
  ghost:
    "bg-transparent text-purple-300 hover:text-white hover:bg-white/5",
  light:
    "bg-white text-black hover:bg-purple-400 hover:text-white shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:neon-glow-purple-strong",
  fuchsia:
    "bg-fuchsia-600 text-white hover:bg-fuchsia-500 neon-glow-fuchsia hover:shadow-[0_0_35px_rgba(56,129,181,0.8)]",
};

const SIZES = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3.5 text-lg",
  lg: "px-9 py-4 text-xl",
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
      className={`${base} ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
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
