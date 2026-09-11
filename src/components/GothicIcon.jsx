import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function GothicIcon({
  icon,
  size = 'inline',
  className = '',
  decorative = true,
  ...props
}) {
  if (!icon) return null;

  return (
    <FontAwesomeIcon
      icon={icon}
      fixedWidth
      className={`gothic-icon gothic-icon--${size} ${className}`}
      aria-hidden={decorative ? 'true' : undefined}
      {...props}
    />
  );
}
