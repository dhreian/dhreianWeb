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
            <stop offset="13%" stopColor="#bcb6c2" />
            <stop offset="31%" stopColor="#514a57" />
            <stop offset="45%" stopColor="#f8f5fa" />
            <stop offset="58%" stopColor="#77707e" />
            <stop offset="72%" stopColor="#ded9e2" />
            <stop offset="86%" stopColor="#3d3743" />
            <stop offset="100%" stopColor="#f2eef5" />
          </linearGradient>
          <linearGradient id={edgeGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="36%" stopColor="#6f6876" />
            <stop offset="62%" stopColor="#2b0a42" />
            <stop offset="100%" stopColor="#0d0612" />
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
