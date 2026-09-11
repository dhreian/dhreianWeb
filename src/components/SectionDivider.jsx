import React, { useId } from 'react';

const GOTHIC_STAR_PATH = 'M36 2 L42.2 22.3 L57.6 8.7 L49.1 27.6 L70 24.8 L51.4 36 L70 47.2 L49.1 44.4 L57.6 63.3 L42.2 49.7 L36 70 L29.8 49.7 L14.4 63.3 L22.9 44.4 L2 47.2 L20.6 36 L2 24.8 L22.9 27.6 L14.4 8.7 L29.8 22.3 Z';
const INNER_STAR_PATH = 'M36 13 L42.6 29.4 L59 36 L42.6 42.6 L36 59 L29.4 42.6 L13 36 L29.4 29.4 Z';

function DividerFiligree({ mirrored = false }) {
  const metalGradientId = `divider-line-metal-${useId().replace(/:/g, '')}`;

  return (
    <svg
      className="section-divider-filigree"
      viewBox="0 0 520 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={metalGradientId}
          x1="0"
          y1="0"
          x2="520"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4b4551" stopOpacity="0" />
          <stop offset="9%" stopColor="#8d8693" stopOpacity="0.78" />
          <stop offset="26%" stopColor="#f9f7fb" />
          <stop offset="43%" stopColor="#615968" />
          <stop offset="61%" stopColor="#e8e4ec" />
          <stop offset="79%" stopColor="#77707e" />
          <stop offset="100%" stopColor="#fdfcff" />
        </linearGradient>
      </defs>
      <g transform={mirrored ? 'translate(520 0) scale(-1 1)' : undefined}>
        <path
          className="section-divider-filigree-shadow"
          d="M0 34 C72 34 111 30 158 25 C218 19 264 38 326 32 C385 27 423 17 474 24 C493 27 506 24 520 17"
        />
        <path
          className="section-divider-filigree-main"
          d="M0 31 C72 31 111 27 158 22 C218 16 264 35 326 29 C385 24 423 14 474 21 C493 24 506 21 520 14"
          stroke={`url(#${metalGradientId})`}
        />
        <path
          className="section-divider-filigree-main section-divider-filigree-main--lower"
          d="M36 39 C117 39 157 34 204 31 C264 27 307 42 371 35 C427 29 473 30 520 22"
          stroke={`url(#${metalGradientId})`}
        />
        <path
          className="section-divider-filigree-highlight"
          d="M0 29.5 C72 29.5 111 25.5 158 20.5 C218 14.5 264 33.5 326 27.5 C385 22.5 423 12.5 474 19.5 C493 22.5 506 19.5 520 12.5"
        />
      </g>
    </svg>
  );
}

function GothicStar() {
  const id = useId().replace(/:/g, '');
  const purpleGradientId = `divider-star-purple-${id}`;
  const purpleEdgeGradientId = `divider-star-edge-${id}`;
  const silverGradientId = `divider-star-silver-${id}`;

  return (
    <svg
      className="section-divider-star"
      viewBox="0 0 72 72"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={purpleGradientId} x1="12" y1="7" x2="58" y2="66" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7856ff" />
          <stop offset="16%" stopColor="#7856ff" />
          <stop offset="34%" stopColor="#7856ff" />
          <stop offset="48%" stopColor="#7856ff" />
          <stop offset="64%" stopColor="#7856ff" />
          <stop offset="80%" stopColor="#7856ff" />
          <stop offset="100%" stopColor="#7856ff" />
        </linearGradient>
        <linearGradient id={purpleEdgeGradientId} x1="36" y1="2" x2="36" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="38%" stopColor="#7856ff" />
          <stop offset="64%" stopColor="#7856ff" />
          <stop offset="100%" stopColor="#7856ff" />
        </linearGradient>
        <linearGradient id={silverGradientId} x1="8" y1="5" x2="61" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#c9c5cf" />
          <stop offset="38%" stopColor="#faf9fc" />
          <stop offset="59%" stopColor="#afa9b6" />
          <stop offset="76%" stopColor="#ece9ef" />
          <stop offset="89%" stopColor="#c5bfcb" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <path
        className="section-divider-star-outer"
        d={GOTHIC_STAR_PATH}
        fill={`url(#${purpleGradientId})`}
        stroke={`url(#${purpleEdgeGradientId})`}
      />
      <path
        className="section-divider-star-inner"
        d={INNER_STAR_PATH}
        fill={`url(#${silverGradientId})`}
        stroke="#7856ff"
      />
      <path
        className="section-divider-star-core"
        d="M36 24 L40.2 31.8 L48 36 L40.2 40.2 L36 48 L31.8 40.2 L24 36 L31.8 31.8 Z"
        fill={`url(#${purpleGradientId})`}
        stroke={`url(#${purpleEdgeGradientId})`}
      />
      <circle cx="36" cy="36" r="2.35" fill="#7856ff" />
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
