import React, { useId, useRef } from 'react';
import {
  faChevronLeft,
  faChevronRight,
  faMusic,
  faSliders,
} from '@fortawesome/free-solid-svg-icons';
import { GiClubs, GiDiamonds, GiHearts, GiSpades } from 'react-icons/gi';
import { TRACKS, PLATFORMS } from '../data/site';
import Card from './Card';
import NeonButton from './Button';
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
  const suitEdge = tone === 'purple' ? '#310568' : '#09080b';

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
                <stop offset="0%" stopColor="#fffaff" />
                <stop offset="18%" stopColor="#b98dff" />
                <stop offset="43%" stopColor="#681cff" />
                <stop offset="54%" stopColor="#2e055f" />
                <stop offset="65%" stopColor="#a873ff" />
                <stop offset="100%" stopColor="#360774" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="20%" stopColor="#a19ba7" />
                <stop offset="45%" stopColor="#29252e" />
                <stop offset="56%" stopColor="#050406" />
                <stop offset="68%" stopColor="#77717e" />
                <stop offset="100%" stopColor="#171319" />
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
        strokeWidth="5"
        paintOrder="stroke fill"
      />
    </span>
  );
}

export default function Hero() {
  const { t } = useLang();
  const featuredTrack = TRACKS[0];
  const otherTracks = TRACKS.slice(1);
  const otherTracksCarouselRef = useRef(null);

  const scrollOtherTracks = (direction) => {
    const carousel = otherTracksCarouselRef.current;
    const firstSlide = carousel?.querySelector('[data-release-slide]');
    if (!carousel || !firstSlide) return;

    const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 0;
    const step = firstSlide.getBoundingClientRect().width + gap;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    const atStart = carousel.scrollLeft <= 4;
    const atEnd = carousel.scrollLeft >= maxScroll - 4;

    if (direction < 0 && atStart) {
      carousel.scrollTo({ left: maxScroll, behavior: 'smooth' });
      return;
    }

    if (direction > 0 && atEnd) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    carousel.scrollBy({ left: direction * step, behavior: 'smooth' });
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

        <div className="hero-banner__releases w-full grid grid-cols-1 gap-4 lg:gap-5 items-stretch">

          {featuredTrack && (
            <Card accent="purple" className="release-playing-card release-playing-card--featured w-full">
              <PlayingCardIndex face={PLAYING_CARD_FACES[0]} />
              <PlayingCardIndex face={PLAYING_CARD_FACES[0]} position="bottom" />

              <div className="latest-release-ribbon" aria-label={t('hero.latest')}>
                <span aria-hidden="true">{t('hero.latest')}</span>
              </div>

              <div className="release-playing-card__content flex items-center h-full gap-4 lg:gap-5">

                <div className="release-cover-recessed release-playing-card__art relative aspect-square w-[39%] shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={featuredTrack.cover}
                    alt={`${t('hero.coverOf')} ${featuredTrack.title}`}
                    width="600"
                    height="600"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="release-playing-card__details flex-1 min-w-0 flex flex-col items-center justify-center text-center gap-3 lg:gap-4">
                  <h2 className="font-display lowercase text-[clamp(2.5rem,3.5vw,3.25rem)] leading-none w-full break-words text-center tracking-tight">
                    <span className="text-purple-800">
                      {featuredTrack.title.toLocaleLowerCase('es')}
                    </span>
                  </h2>

                  <p className="font-body text-[clamp(1.0625rem,1.4vw,1.3rem)] leading-[1.15] font-medium normal-case tracking-[0.04em] w-full text-black">
                    <span className="block whitespace-nowrap">{featuredTrack.mainArtist}</span>
                    {featuredTrack.featArtist && (
                      <span className="block whitespace-nowrap">
                        ft. {featuredTrack.featArtist}
                      </span>
                    )}
                  </p>

                  <div className="release-playing-card__platforms flex gap-3 lg:gap-4 justify-center">
                    {PLATFORMS.map((p) => (
                      <a
                        key={p.key}
                        href={featuredTrack.links[p.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${t('hero.listenOn')} ${p.key === 'youtube' && featuredTrack.links.youtube.includes('music.youtube.com') ? 'YouTube Music' : p.title}`}
                        data-platform={p.key}
                        className="platform-metallic-button liquid-glass-button grid h-14 w-14 place-items-center rounded-full border leading-none text-white transition-all duration-300 lg:h-16 lg:w-16"
                      >
                        <GothicIcon icon={p.icon} size="release-platform-featured" className="block" />
                      </a>
                    ))}
                  </div>

                </div>
              </div>
            </Card>
          )}

          <div className="release-carousel-shell flex items-stretch gap-2 lg:gap-3 min-w-0">

            {otherTracks.length > 3 && (
              <button
                type="button"
                onClick={() => scrollOtherTracks(-1)}
                className="metallic-dark-control liquid-glass-button grid h-8 w-8 shrink-0 place-items-center self-center rounded-full border text-zinc-200 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 lg:h-10 lg:w-10"
                aria-label={t('hero.previousRelease')}
              >
                <GothicIcon icon={faChevronLeft} size="control" />
              </button>
            )}

            <div
              ref={otherTracksCarouselRef}
              className="flex gap-3 lg:gap-4 flex-1 min-w-0 min-h-0 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory scrollbar-hide"
              role="region"
              aria-roledescription="carousel"
              aria-label={t('hero.otherReleases')}
            >
              {otherTracks.map((track, idx) => (
                <div
                  key={track.title}
                  data-release-slide
                  className="release-card-slot snap-start min-w-0"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${track.title}, ${idx + 1} ${t('hero.of')} ${otherTracks.length}`}
                >
                  <Card accent="subtle" className="release-playing-card release-playing-card--compact">
                    <PlayingCardIndex face={PLAYING_CARD_FACES[idx + 1]} />
                    <PlayingCardIndex face={PLAYING_CARD_FACES[idx + 1]} position="bottom" />

                    <div className="release-playing-card__content flex flex-col">

                      <div className="release-cover-recessed release-playing-card__art aspect-square shrink-0 overflow-hidden rounded-xl">
                        <img
                          src={track.cover}
                          alt={`${t('hero.coverOf')} ${track.title}`}
                          width="600"
                          height="600"
                          loading="lazy"
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

            {otherTracks.length > 3 && (
              <button
                type="button"
                onClick={() => scrollOtherTracks(1)}
                className="metallic-dark-control liquid-glass-button grid h-8 w-8 shrink-0 place-items-center self-center rounded-full border text-zinc-200 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 lg:h-10 lg:w-10"
                aria-label={t('hero.nextRelease')}
              >
                <GothicIcon icon={faChevronRight} size="control" />
              </button>
            )}
          </div>
        </div>

        <div className="hero-banner__ctas flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 md:mt-16">
          <NeonButton href="/beats" variant="primary" size="lg" icon={faMusic}>
            {t('hero.ctaBeats')}
          </NeonButton>
          <NeonButton href="/servicios" variant="outline" size="lg" icon={faSliders}>
            {t('hero.ctaServices')}
          </NeonButton>
        </div>
      </div>

      <SectionDivider className="section-boundary-divider pointer-events-none absolute inset-x-0 bottom-0 z-20 w-full" />
    </section>
  );
}
