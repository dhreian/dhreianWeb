import React from 'react';
import GothicIcon from './GothicIcon';
import OrnateTitle from './OrnateTitle';
import SectionDivider from './SectionDivider';

export function Section({
  id,
  children,
  className = '',
  containerClassName = 'max-w-7xl mx-auto',
  bare = false,
  divider = false,
}) {
  return (
    <section id={id} className={`section-shell px-4 md:px-8 relative overflow-visible ${className}`}>
      {bare ? children : <div className={`relative z-10 ${containerClassName}`}>{children}</div>}

      {divider && (
        <SectionDivider className="section-boundary-divider absolute inset-x-0 bottom-0 z-20 w-full pointer-events-none" />
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
          <span className="section-eyebrow-spines" aria-hidden="true"></span>
          <span className="font-body text-white tracking-[0.3em] text-label uppercase font-semibold">
            {eyebrow}
          </span>
          <span className="section-eyebrow-spines section-eyebrow-spines--right" aria-hidden="true"></span>
        </div>
      )}
      <h2 className="font-display lowercase text-section tracking-tight">
        {icon && (
          <GothicIcon
            icon={icon}
            size="heading"
            className={`mr-3 ${accentColor} inline-block align-middle`}
          />
        )}
        <OrnateTitle>{title}</OrnateTitle>
      </h2>
      {subtitle && <p className={subtitleClass}>{subtitle}</p>}
    </div>
  );
}
