import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Section({
  id,
  children,
  className = '',
  containerClassName = 'max-w-7xl mx-auto',
  bare = false,
  divider = false,
}) {
  return (
    <section id={id} className={`py-12 md:py-16 px-4 md:px-8 relative overflow-hidden ${className}`}>
      {bare ? children : <div className={`relative z-10 ${containerClassName}`}>{children}</div>}

      {divider && (
        <div
          className="absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-purple-500 md:w-1/2 pointer-events-none"
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
}) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  const eyebrowJustify = align === 'center' ? 'justify-center' : 'justify-start';
  const subtitleClass =
    align === 'center'
      ? 'text-subtitle text-white mt-5 max-w-2xl mx-auto'
      : 'text-subtitle text-white mt-3 max-w-2xl';
  const accentColor = 'text-purple-400';

  return (
    <div className={`mb-12 md:mb-16 ${alignClass}`}>
      {eyebrow && (
        <div className={`flex items-center gap-3 mb-5 ${eyebrowJustify}`}>
          <span className="h-px w-10 bg-purple-500"></span>
          <span className="font-body text-white tracking-[0.3em] text-label uppercase font-semibold">
            {eyebrow}
          </span>
          <span className="h-px w-10 bg-purple-500"></span>
        </div>
      )}
      <h2 className="font-display lowercase text-section tracking-tight">
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className={`mr-4 ${accentColor} text-3xl md:text-4xl align-middle`}
          />
        )}
        <span className="section-title-lockup">
          <span className="section-title-ornament" aria-hidden="true">✦</span>
          <span className="section-title-accent">{title}</span>
          <span className="section-title-ornament" aria-hidden="true">✦</span>
        </span>
      </h2>
      {subtitle && <p className={subtitleClass}>{subtitle}</p>}
    </div>
  );
}
