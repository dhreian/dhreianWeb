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
              className={`font-display lowercase px-4 py-2 rounded-2xl text-base sm:text-lg tracking-wide transition-all duration-300 inline-flex items-center gap-2.5 border focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${
                active
                  ? 'bg-purple-600 text-white border-purple-600 shadow-[0_0_20px_rgba(138,108,255,0.6)]'
                  : 'bg-zinc-900/80 text-zinc-400 border-purple-500/20 hover:border-purple-500/60 hover:text-purple-200 hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(138,108,255,0.3)]'
              }`}
            >
              <span>{g}</span>
              <span
                className={`text-xs tabular-nums font-body font-semibold px-2 py-0.5 rounded-2xl ${
                  active ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-500'
                }`}
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
        <div className="text-center py-20 px-4 rounded-2xl border border-purple-500/20 bg-zinc-900/40">
          <p className="font-display lowercase text-3xl text-zinc-300 mb-3 neon-text-purple">
            sin beats en este género
          </p>
          <p className="text-base text-zinc-400">
            Prueba con otro filtro o revisa el catálogo completo en BeatStars.
          </p>
        </div>
      )}
    </div>
  );
}
