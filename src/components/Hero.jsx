import React, { useCallback, useEffect, useId, useRef } from 'react';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { GiClubs, GiDiamonds, GiHearts, GiSpades } from 'react-icons/gi';
import { TRACKS, PLATFORMS } from '../data/site';
import Card from './Card';
import { useLang } from '../i18n/LanguageContext';
import GothicIcon from './GothicIcon';
import SectionDivider from './SectionDivider';

// Keep the hero logo on the public asset path so the prerendered HTML and the
// hydrated client use the same URL in production.
const metallicLogo = '/icons/dhreian-logo-transparent-512.png';

const PLAYING_CARD_FACES = [
  { rank: 'A', SuitIcon: GiSpades, tone: 'ink' },
  { rank: 'K', SuitIcon: GiHearts, tone: 'purple' },
  { rank: 'Q', SuitIcon: GiDiamonds, tone: 'purple' },
  { rank: 'J', SuitIcon: GiClubs, tone: 'ink' },
  { rank: '10', SuitIcon: GiSpades, tone: 'ink' },
];

function PlayingCardIndex({ face, position = 'top' }) {
  const { rank, SuitIcon, tone } = face;
  const suitGradientId = `playing-card-suit-${tone}-${useId().replace(/:/g, '')}`;
  const suitEdge = tone === 'purple' ? '#b696ff' : '#77717e';

  return (
    <span
      className={`playing-card-index playing-card-index--${position} playing-card-index--${tone}`}
      aria-hidden="true"
    >
      <svg className="playing-card-metal-defs" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={suitGradientId} x1="0" y1="0" x2="1" y2="1">
            {tone === 'purple' ? (
              <>
                <stop offset="0%" stopColor="#b995ff" />
                <stop offset="16%" stopColor="#6f24f5" />
                <stop offset="34%" stopColor="#350677" />
                <stop offset="48%" stopColor="#a36fff" />
                <stop offset="64%" stopColor="#4b0aab" />
                <stop offset="80%" stopColor="#8a42ff" />
                <stop offset="100%" stopColor="#260452" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#77717e" />
                <stop offset="16%" stopColor="#29252f" />
                <stop offset="34%" stopColor="#09080b" />
                <stop offset="48%" stopColor="#68616f" />
                <stop offset="64%" stopColor="#17141c" />
                <stop offset="80%" stopColor="#403947" />
                <stop offset="100%" stopColor="#050407" />
              </>
            )}
          </linearGradient>
        </defs>
      </svg>
      <span className="playing-card-index__rank">{rank}</span>
      <SuitIcon
        className="playing-card-index__suit"
        fill={`url(#${suitGradientId})`}
        stroke={suitEdge}
        strokeWidth="24"
        paintOrder="stroke fill"
      />
    </span>
  );
}

export default function Hero() {
  const { t } = useLang();
  const releasesCarouselRef = useRef(null);

  const updateDeckPosition = useCallback(() => {
    const carousel = releasesCarouselRef.current;
    if (!carousel) return;

    const slides = carousel.querySelectorAll('[data-release-slide]');
    const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;

    slides.forEach((slide) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const relativePosition = (slideCenter - carouselCenter) / slide.offsetWidth;
      const clampedPosition = Math.max(-2.5, Math.min(2.5, relativePosition));
      const distance = Math.abs(clampedPosition);

      slide.style.setProperty('--deck-tilt', `${clampedPosition * -2.15}deg`);
      slide.style.setProperty('--deck-lift', `${distance * 0.45}rem`);
      slide.style.setProperty('--deck-scale', `${Math.max(0.95, 1 - distance * 0.018)}`);
      slide.style.setProperty('--deck-opacity', `${Math.max(0.78, 1 - distance * 0.055)}`);
      slide.style.zIndex = `${10 - Math.round(distance * 2)}`;
    });
  }, []);

  useEffect(() => {
    const carousel = releasesCarouselRef.current;
    if (!carousel) return undefined;

    let animationFrame = 0;
    const scheduleDeckUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        updateDeckPosition();
      });
    };

    scheduleDeckUpdate();
    carousel.addEventListener('scroll', scheduleDeckUpdate, { passive: true });
    window.addEventListener('resize', scheduleDeckUpdate);

    return () => {
      carousel.removeEventListener('scroll', scheduleDeckUpdate);
      window.removeEventListener('resize', scheduleDeckUpdate);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [updateDeckPosition]);

  const scrollReleases = (direction) => {
    const carousel = releasesCarouselRef.current;
    const firstSlide = carousel?.querySelector('[data-release-slide]');
    if (!carousel || !firstSlide) return;

    const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 0;
    const step = firstSlide.getBoundingClientRect().width + gap;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    const atStart = carousel.scrollLeft <= 4;
    const atEnd = carousel.scrollLeft >= maxScroll - 4;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

    if (direction < 0 && atStart) {
      carousel.scrollTo({ left: maxScroll, behavior });
      return;
    }

    if (direction > 0 && atEnd) {
      carousel.scrollTo({ left: 0, behavior });
      return;
    }

    carousel.scrollBy({ left: direction * step, behavior });
  };

  return (
    <section
      id="portfolio"
      className="hero-banner relative min-h-screen flex flex-col px-4 md:px-8 overflow-visible bg-black"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-grow flex flex-col justify-center">

        <header className="hero-banner__header text-center flex flex-col">
          <h1 className="sr-only">dhreian</h1>
          <div className="hero-banner__brand-mark">
            <img
              src={metallicLogo}
              width="512"
              height="512"
              alt="Logo de dhreian"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="hero-banner__logo h-auto w-32 object-contain md:w-40 lg:w-44"
            />
          </div>
        </header>

        <div className="hero-banner__releases w-full">
          <div className="release-carousel-shell min-w-0">

            {TRACKS.length > 1 && (
              <button
                type="button"
                onClick={() => scrollReleases(-1)}
                className="release-carousel-control release-carousel-control--previous metallic-dark-control liquid-glass-button grid h-9 w-9 place-items-center rounded-full border text-zinc-200 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 lg:h-11 lg:w-11"
                aria-label={t('hero.previousRelease')}
              >
                <GothicIcon icon={faChevronLeft} size="control" />
              </button>
            )}

            <div
              ref={releasesCarouselRef}
              className="release-carousel flex w-full min-w-0 min-h-0 gap-3 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scrollbar-hide lg:gap-4"
              role="region"
              aria-roledescription="carousel"
              aria-label={t('hero.otherReleases')}
            >
              {TRACKS.map((track, idx) => (
                <div
                  key={track.title}
                  data-release-slide
                  className="release-card-slot snap-start min-w-0"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${track.title}, ${idx + 1} ${t('hero.of')} ${TRACKS.length}`}
                >
                  <Card accent={idx === 0 ? 'purple' : 'subtle'} className="release-playing-card release-playing-card--compact">
                    <PlayingCardIndex face={PLAYING_CARD_FACES[idx % PLAYING_CARD_FACES.length]} />
                    <PlayingCardIndex face={PLAYING_CARD_FACES[idx % PLAYING_CARD_FACES.length]} position="bottom" />

                    {idx === 0 && (
                      <div className="latest-release-ribbon" aria-label={t('hero.latest')}>
                        <span aria-hidden="true">{t('hero.latest')}</span>
                      </div>
                    )}

                    <div className="release-playing-card__content flex flex-col">

                      <div className="release-cover-recessed release-playing-card__art aspect-square shrink-0 overflow-hidden rounded-xl">
                        <img
                          src={track.cover}
                          alt={`${t('hero.coverOf')} ${track.title}`}
                          width="600"
                          height="600"
                          loading={idx === 0 ? 'eager' : 'lazy'}
                          fetchPriority={idx === 0 ? 'high' : 'auto'}
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="release-playing-card__copy shrink-0 min-w-0 text-center">
                        <p className="font-body text-[clamp(1rem,1.1vw,1.125rem)] leading-[1.1] font-medium text-black normal-case tracking-[0.04em] text-center">
                          {track.mainArtist}
                        </p>
                        {track.featArtist && (
                          <p className="font-body text-[clamp(1rem,1.1vw,1.125rem)] leading-[1.1] font-medium text-black normal-case tracking-[0.04em] text-center">
                            ft. {track.featArtist}
                          </p>
                        )}
                        <h3
                          className={`mt-0.5 w-full break-words text-center font-display lowercase text-[clamp(1.25rem,1.6vw,1.5rem)] leading-[1.05] tracking-tight ${track.title === 'amanecer contigo' ? 'release-playing-card__title--single-line' : ''}`}
                        >
                          <span className="text-purple-800">
                            {track.title.toLocaleLowerCase('es')}
                          </span>
                        </h3>
                      </div>

                      <div className="release-playing-card__platforms shrink-0 flex gap-1.5 lg:gap-2 justify-center">
                        {PLATFORMS.map((p) => (
                          <a
                            key={p.key}
                            href={track.links[p.key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`${t('hero.listenOn')} ${p.key === 'youtube' && track.links.youtube.includes('music.youtube.com') ? 'YouTube Music' : p.title}`}
                            data-platform={p.key}
                            className="platform-metallic-button liquid-glass-button grid h-9 w-9 shrink-0 place-items-center rounded-full border leading-none text-white transition-all duration-300 lg:h-10 lg:w-10"
                          >
                            <GothicIcon icon={p.icon} size="release-platform" className="block" />
                          </a>
                        ))}
                      </div>

                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {TRACKS.length > 1 && (
              <button
                type="button"
                onClick={() => scrollReleases(1)}
                className="release-carousel-control release-carousel-control--next metallic-dark-control liquid-glass-button grid h-9 w-9 place-items-center rounded-full border text-zinc-200 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 lg:h-11 lg:w-11"
                aria-label={t('hero.nextRelease')}
              >
                <GothicIcon icon={faChevronRight} size="control" />
              </button>
            )}
          </div>
        </div>

      </div>

      <SectionDivider className="section-boundary-divider pointer-events-none absolute inset-x-0 bottom-0 z-20 w-full" />
    </section>
  );
}
