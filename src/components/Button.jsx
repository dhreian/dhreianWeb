import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VARIANTS = {
  primary:
    "primary-action-button",
  outline:
    "secondary-action-button",
  glass:
    "border border-zinc-300 bg-white text-zinc-950 hover:border-black hover:bg-black hover:text-white",
  ghost:
    "border border-zinc-800 bg-black text-white hover:border-purple-500 hover:text-purple-500",
  light:
    "border border-zinc-300 bg-white text-black hover:border-black hover:bg-black hover:text-white",
};

const SIZES = {
  sm: "px-5 py-2.5 text-button-sm",
  md: "px-7 py-3.5 text-button",
  lg: "px-9 py-4 text-button-lg",
};

export default function NeonButton({
  as: Component = 'a',
  variant = 'primary',
  size = 'md',
  surface = 'dark',
  icon,
  children,
  className = '',
  ...rest
}) {
  const base =
    "liquid-glass-button inline-flex items-center justify-center gap-3 rounded-2xl font-display lowercase tracking-wide transition-colors duration-300 group cursor-pointer select-none";
  const usesStandardActionSize = variant === 'primary' || variant === 'outline';
  const resolvedSize = usesStandardActionSize ? '' : (SIZES[size] || SIZES.md);
  const surfaceClass = variant === 'primary' && surface === 'light'
    ? 'primary-action-button--on-light'
    : '';

  return (
    <Component
      className={`${base} ${resolvedSize} ${VARIANTS[variant] || VARIANTS.primary} ${surfaceClass} ${className}`}
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
