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
import NeonButton from './Button';

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
            className="absolute inset-0 block w-full h-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-zinc-900">
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
                className={`liquid-glass-button primary-action-button primary-action-button--icon grid place-items-center transition-opacity duration-300 ${
                  isActive
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100 touch:opacity-100'
                }`}
              >
                <FontAwesomeIcon
                  icon={playIcon}
                  fixedWidth
                  className={`text-current text-2xl ${
                    loading && isActive ? 'animate-spin' : isActive || error ? '' : 'ml-1'
                  }`}
                />
              </span>
            </button>
          </>
        )}

        {(hasTags || hasAudio) && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-black/80 p-4 pt-16">
            {hasTags && (
              <div className="flex flex-wrap items-center gap-1.5 text-meta font-body">
                {beat.musicalKey && (
                  <span className="metallic-purple-badge rounded-2xl border px-2 py-1 font-bold uppercase tracking-wider">
                    {beat.musicalKey.toUpperCase()}
                  </span>
                )}
                {beat.bpm && (
                  <span className="metallic-purple-badge rounded-2xl border px-2 py-1 font-bold tracking-wider">
                    {beat.bpm} BPM
                  </span>
                )}
                {beat.genres?.map((genre) => (
                  <span
                    key={genre}
                    className="metallic-dark-badge rounded-2xl border px-2 py-1 font-bold uppercase tracking-wider"
                  >
                    {genre.toUpperCase()}
                  </span>
                ))}
              </div>
            )}

            {hasAudio && (
              <div
                className={`${hasTags ? 'mt-3' : ''} grid grid-cols-[2.25rem_1fr_2.25rem] items-center gap-2 font-body text-meta font-semibold tabular-nums text-white/85 pointer-events-auto`}
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

      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <h3 className="font-display lowercase text-card-compact text-zinc-950 group-hover:text-purple-800 transition-colors truncate pb-1">
          {beat.title}
        </h3>

        <div className="flex items-center gap-3 w-full">
          <div className="secondary-action-label flex h-[3.25rem] w-24 shrink-0 items-center justify-center truncate px-3 text-center lowercase">
            {beat.price || '$29.99'}
          </div>
          <NeonButton
            href={beat.beatstarsUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            surface="light"
            size="md"
            icon={faArrowUpRightFromSquare}
            className="flex-1"
          >
            comprar
          </NeonButton>
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
