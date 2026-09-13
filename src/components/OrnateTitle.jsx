import React from 'react';
import { GiBatWing } from 'react-icons/gi';

export default function OrnateTitle({ children, tone = 'purple', className = '' }) {
  return (
    <span className={`section-title-lockup section-title-lockup--${tone} ${className}`}>
      <GiBatWing
        className="section-title-ornament"
        fill="#874dfa"
        stroke="#874dfa"
        aria-hidden="true"
      />
      <span className="section-title-accent">{children}</span>
      <GiBatWing
        className="section-title-ornament section-title-ornament--right"
        fill="#874dfa"
        stroke="#874dfa"
        aria-hidden="true"
      />
    </span>
  );
}
