import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faArrowUpRightFromSquare,
  faSpinner,
  faCircleExclamation,
  faMusic,
} from '@fortawesome/free-solid-svg-icons';
import Card from './Card';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

export default function BeatCard({ beat, isActive, onPlay, onPause }) {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const hasAudio = Boolean(beat.preview);
  const hasCover = Boolean(beat.cover);
  const hasTags = Boolean(beat.musicalKey || beat.bpm || beat.genres?.length > 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isActive) {
      audio.play().catch(() => onPause());
    } else {
      audio.pause();
    }
  }, [isActive, onPause]);

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (error) return;
    if (isActive) onPause();
    else onPlay(beat.slug);
  };

  const handleSeekChange = (e) => {
    e.stopPropagation();
    const nextTime = Number(e.currentTarget.value);
    if (!Number.isFinite(nextTime)) return;
    const audio = audioRef.current;
    if (audio) audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const stopControlEvent = (e) => {
    e.stopPropagation();
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const playIcon = error
    ? faCircleExclamation
    : loading && isActive
      ? faSpinner
      : isActive
        ? faPause
        : faPlay;

  return (
    <Card
      accent={isActive ? 'purple' : 'subtle'}
      className="h-full w-full !p-0"
    >
      <div className="relative flex flex-col h-full">
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-800 shrink-0">
        {hasCover ? (
          <img
            src={beat.cover}
            alt={`Carátula de ${beat.title}`}
            width="600"
            height="600"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 block w-full h-full object-cover transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 grid place-items-center">
            <FontAwesomeIcon icon={faMusic} className="text-zinc-700 text-5xl" />
          </div>
        )}

        {hasAudio && (
          <>
            <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${isActive ? 'opacity-60' : 'opacity-0 group-hover:opacity-40 touch:opacity-20'}`}></div>

            <button
              onClick={togglePlay}
              aria-label={isActive ? `Pausar ${beat.title}` : `Reproducir ${beat.title}`}
              className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300/70"
            >
              <span
                className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-950 grid place-items-center transition-all duration-300 active:scale-95 ${
                  isActive
                    ? 'scale-100 opacity-100 shadow-[0_0_30px_rgba(138,108,255,0.9)]'
                    : 'scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 touch:scale-100 touch:opacity-100 shadow-[0_0_20px_rgba(138,108,255,0.7)]'
                }`}
              >
                <FontAwesomeIcon
                  icon={playIcon}
                  fixedWidth
                  className={`text-white text-2xl ${
                    loading && isActive ? 'animate-spin' : isActive || error ? '' : 'ml-1'
                  }`}
                />
              </span>
            </button>
          </>
        )}

        {(hasTags || hasAudio) && (
          <div className="absolute inset-x-0 bottom-0 z-20 p-4 pt-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
            {hasTags && (
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-body">
                {beat.musicalKey && (
                  <span className="px-2 py-1 rounded-2xl bg-fuchsia-950/80 border border-fuchsia-400/50 text-fuchsia-100 font-bold tracking-wider uppercase shadow-[0_0_4px_rgba(0,0,0,0.3)]">
                    {beat.musicalKey.toUpperCase()}
                  </span>
                )}
                {beat.bpm && (
                  <span className="px-2 py-1 rounded-2xl bg-purple-500/40 border border-purple-300/40 text-purple-100 font-bold tracking-wider shadow-[0_0_4px_rgba(0,0,0,0.3)]">
                    {beat.bpm} BPM
                  </span>
                )}
                {beat.genres?.map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-1 rounded-2xl bg-fuchsia-950/70 border border-white/25 text-white font-bold tracking-wider uppercase shadow-[0_0_4px_rgba(0,0,0,0.3)]"
                  >
                    {genre.toUpperCase()}
                  </span>
                ))}
              </div>
            )}

            {hasAudio && (
              <div
                className={`${hasTags ? 'mt-3' : ''} grid grid-cols-[2.25rem_1fr_2.25rem] items-center gap-2 font-body text-[10px] font-semibold tabular-nums text-white/85 pointer-events-auto`}
                onClick={stopControlEvent}
                onPointerDown={stopControlEvent}
              >
                <span>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.01"
                  value={duration ? Math.min(currentTime, duration) : 0}
                  disabled={!duration}
                  onChange={handleSeekChange}
                  aria-label={`Progreso de ${beat.title}`}
                  className="beat-progress-range"
                  style={{ '--progress': `${progress}%` }}
                />
                <span className="text-right">{formatTime(duration)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow gap-4">
        <h3 className="font-display lowercase text-2xl text-white group-hover:text-purple-200 transition-colors truncate pb-1">
          {beat.title}
        </h3>

        <div className="mt-auto flex items-center gap-3 w-full">
          <div className="w-24 shrink-0 h-12 flex items-center justify-center px-2 rounded-2xl bg-zinc-800/50 border border-white/5 text-purple-200 font-body font-bold text-sm text-center truncate">
            {beat.price || '$29.99'}
          </div>
          <a
            href={beat.beatstarsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-12 flex items-center justify-center gap-2 rounded-2xl border border-purple-600 bg-purple-600 text-white font-display lowercase text-lg transition-all duration-300 hover:bg-purple-500 hover:border-purple-500 hover:neon-glow-purple"
          >
            <span>comprar</span>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />
          </a>
        </div>
      </div>

      {hasAudio && (
        <audio
          ref={audioRef}
          src={beat.preview}
          preload="metadata"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onEnded={() => onPause()}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          onPlaying={() => setLoading(false)}
          onCanPlay={() => setLoading(false)}
          onWaiting={() => setLoading(true)}
        />
      )}
      </div>
    </Card>
  );
}
