import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export default function FeatureList({ items, accent = 'purple', dense = false }) {
  if (dense) {
    const dotColor = accent === 'fuchsia' ? 'bg-fuchsia-500' : 'bg-purple-500';
    return (
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`}></span>
            {item}
          </li>
        ))}
      </ul>
    );
  }

  const checkColor = accent === 'fuchsia' ? 'text-fuchsia-400' : 'text-purple-400';
  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3">
          <FontAwesomeIcon
            icon={faCircleCheck}
            className={`${checkColor} text-base shrink-0`}
          />
          <span className="text-sm text-zinc-300">{item}</span>
        </li>
      ))}
    </ul>
  );
}
