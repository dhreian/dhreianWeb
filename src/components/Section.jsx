import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Section({
  id,
  children,
  className = '',
  containerClassName = 'max-w-7xl mx-auto',
  bare = false,
  divider = false,
  dividerAccent = 'purple',
  glow = false,
  glowAccent = 'purple',
}) {
  return (
    <section id={id} className={`py-12 md:py-16 px-4 md:px-8 relative overflow-hidden ${className}`}>
      {glow && (
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-4xl h-[300px] rounded-full blur-[140px] pointer-events-none opacity-40 transition-all duration-1000 transform-gpu ${
            glowAccent === 'fuchsia' ? 'bg-fuchsia-900/15' : 'bg-purple-900/15'
          }`}
        />
      )}

      {bare ? children : <div className={`relative z-10 ${containerClassName}`}>{children}</div>}

      {divider && (
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 md:w-1/2 h-px bg-gradient-to-r from-transparent ${
            dividerAccent === 'fuchsia' ? 'via-fuchsia-500/20' : 'via-purple-500/20'
          } to-transparent pointer-events-none`}
        />
      )}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  icon,
  align = 'center',
  accent = 'purple',
}) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  const eyebrowJustify = align === 'center' ? 'justify-center' : 'justify-start';
  const subtitleClass =
    align === 'center'
      ? 'text-zinc-400 mt-5 max-w-2xl mx-auto leading-relaxed'
      : 'text-zinc-400 mt-3 max-w-2xl leading-relaxed';
  const neonClass = accent === 'fuchsia' ? 'neon-text-fuchsia' : 'neon-text-purple';
  const accentColor = accent === 'fuchsia' ? 'text-fuchsia-400' : 'text-purple-400';

  return (
    <div className={`mb-12 md:mb-16 ${alignClass}`}>
      {eyebrow && (
        <div className={`flex items-center gap-3 mb-5 ${eyebrowJustify}`}>
          <span className={`h-px w-10 bg-gradient-to-r ${
            accent === 'fuchsia' ? 'from-fuchsia-500' : 'from-purple-500'
          } to-transparent`}></span>
          <span className={`font-body ${accentColor} tracking-[0.3em] text-xs uppercase font-semibold`}>
            {eyebrow}
          </span>
          <span className={`h-px w-10 bg-gradient-to-l ${
            accent === 'fuchsia' ? 'from-fuchsia-500' : 'from-purple-500'
          } to-transparent`}></span>
        </div>
      )}
      <h2 className={`font-display lowercase text-4xl md:text-5xl text-white ${neonClass}`}>
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className={`mr-4 ${accentColor} text-3xl md:text-4xl align-middle`}
          />
        )}
        {title}
      </h2>
      {subtitle && <p className={subtitleClass}>{subtitle}</p>}
    </div>
  );
}
