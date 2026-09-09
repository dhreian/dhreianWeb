import React, { useMemo, useState, useCallback } from 'react';
import BeatCard from './BeatCard';
import { BEATS } from '../data/site';

const ALL = 'todos';

export default function Catalog() {
  const [activeGenre, setActiveGenre] = useState(ALL);
  const [activeSlug, setActiveSlug] = useState(null);

  const genres = useMemo(() => {
    const set = new Set();
    BEATS.forEach((b) => b.genres.forEach((g) => set.add(g)));
    return [ALL, ...Array.from(set).sort()];
  }, []);

  const counts = useMemo(() => {
    const c = { [ALL]: BEATS.length };
    BEATS.forEach((b) => b.genres.forEach((g) => {
      c[g] = (c[g] || 0) + 1;
    }));
    return c;
  }, []);

  const visibleBeats = useMemo(
    () => (activeGenre === ALL ? BEATS : BEATS.filter((b) => b.genres.includes(activeGenre))),
    [activeGenre]
  );

  const handleGenreChange = (g) => {
    setActiveGenre(g);
    if (activeSlug && g !== ALL) {
      const beat = BEATS.find((b) => b.slug === activeSlug);
      if (beat && !beat.genres.includes(g)) setActiveSlug(null);
    }
  };

  const handlePlay = useCallback((slug) => setActiveSlug(slug), []);
  const handlePause = useCallback(() => setActiveSlug(null), []);

  return (
    <div className="w-full">
      {genres.length > 1 && (
      <div className="flex flex-wrap gap-3 mb-10 justify-center">
        {genres.map((g) => {
          const active = g === activeGenre;
          return (
            <button
              key={g}
              type="button"
              onClick={() => handleGenreChange(g)}
              aria-pressed={active}
              className={`catalog-filter-button liquid-glass-button group inline-flex items-center gap-3 rounded-2xl font-display text-button lowercase tracking-wide transition-colors duration-300 ${
                active
                  ? 'primary-action-button'
                  : 'secondary-action-button'
              }`}
            >
              <span>{g}</span>
              <span
                className="catalog-filter-count rounded-2xl border px-2 py-0.5 font-body text-meta font-semibold tabular-nums transition-colors duration-300"
              >
                {counts[g] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
      )}

      {visibleBeats.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {visibleBeats.map((beat) => (
            <div
              key={beat.slug}
              className="beat-card-slot"
            >
              <BeatCard
                beat={beat}
                isActive={activeSlug === beat.slug}
                onPlay={handlePlay}
                onPause={handlePause}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="liquid-glass-card rounded-2xl border border-purple-500 px-4 py-20 text-center">
          <p className="font-display lowercase text-card text-zinc-950 mb-3">
            sin beats en este género
          </p>
          <p className="text-body text-zinc-700">
            Prueba con otro filtro o revisa el catálogo completo en BeatStars.
          </p>
        </div>
      )}
    </div>
  );
}
