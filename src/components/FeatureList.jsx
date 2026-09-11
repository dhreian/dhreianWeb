import React from 'react';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import GothicIcon from './GothicIcon';

export default function FeatureList({ items, dense = false }) {
  if (dense) {
    return (
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-body-compact text-black">
            <span className="metallic-feature-marker" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3">
          <GothicIcon icon={faCircleCheck} size="control" className="shrink-0 text-purple-500" />
          <span className="text-body-compact text-black">{item}</span>
        </li>
      ))}
    </ul>
  );
}
