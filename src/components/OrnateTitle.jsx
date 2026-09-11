import React, { useId } from 'react';
import { GiBatWing } from 'react-icons/gi';

export default function OrnateTitle({ children, tone = 'purple', className = '' }) {
  const id = useId().replace(/:/g, '');
  const metalGradientId = `bat-wing-metal-${id}`;
  const edgeGradientId = `bat-wing-edge-${id}`;

  return (
    <span className={`section-title-lockup section-title-lockup--${tone} ${className}`}>
      <svg className="section-title-metal-defs" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={metalGradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#c9c5cf" />
            <stop offset="38%" stopColor="#faf9fc" />
            <stop offset="59%" stopColor="#afa9b6" />
            <stop offset="76%" stopColor="#ece9ef" />
            <stop offset="89%" stopColor="#c5bfcb" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <linearGradient id={edgeGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="38%" stopColor="#7856ff" />
            <stop offset="64%" stopColor="#5b5263" />
            <stop offset="100%" stopColor="#211a27" />
          </linearGradient>
        </defs>
      </svg>
      <GiBatWing
        className="section-title-ornament"
        fill={`url(#${metalGradientId})`}
        style={{ stroke: `url(#${edgeGradientId})` }}
        aria-hidden="true"
      />
      <span className="section-title-accent">{children}</span>
      <GiBatWing
        className="section-title-ornament section-title-ornament--right"
        fill={`url(#${metalGradientId})`}
        style={{ stroke: `url(#${edgeGradientId})` }}
        aria-hidden="true"
      />
    </span>
  );
}
