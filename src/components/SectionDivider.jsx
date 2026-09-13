import React from 'react';

const GOTHIC_STAR_PATH = 'M36 2 L42.2 22.3 L57.6 8.7 L49.1 27.6 L70 24.8 L51.4 36 L70 47.2 L49.1 44.4 L57.6 63.3 L42.2 49.7 L36 70 L29.8 49.7 L14.4 63.3 L22.9 44.4 L2 47.2 L20.6 36 L2 24.8 L22.9 27.6 L14.4 8.7 L29.8 22.3 Z';
function DividerFiligree({ mirrored = false }) {
  return (
    <svg
      className="section-divider-filigree"
      viewBox="0 0 520 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <g transform={mirrored ? 'translate(520 0) scale(-1 1)' : undefined}>
        <path
          className="section-divider-filigree-main"
          d="M0 31 C72 31 111 27 158 22 C218 16 264 35 326 29 C385 24 423 14 474 21 C493 24 506 21 520 14"
          stroke="#874dfa"
        />
      </g>
    </svg>
  );
}

function GothicStar() {
  return (
    <svg
      className="section-divider-star"
      viewBox="0 0 72 72"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="section-divider-star-outer"
        d={GOTHIC_STAR_PATH}
        fill="#874dfa"
        stroke="#874dfa"
      />
    </svg>
  );
}

export default function SectionDivider({ className = '' }) {
  return (
    <div className={`metallic-divider-horizontal ${className}`} aria-hidden="true">
      <DividerFiligree />
      <GothicStar />
      <DividerFiligree mirrored />
    </div>
  );
}
