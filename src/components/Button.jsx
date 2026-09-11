import React from 'react';
import GothicIcon from './GothicIcon';

const VARIANTS = {
  primary:
    "primary-action-button",
  outline:
    "secondary-action-button",
  glass:
    "metallic-control border text-zinc-950",
  ghost:
    "metallic-dark-control border text-white",
  light:
    "metallic-control border text-black",
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
        <GothicIcon
          icon={icon}
          size="button"
        />
      )}
    </Component>
  );
}
