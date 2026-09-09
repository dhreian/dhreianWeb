import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faMusic, faSliders } from '@fortawesome/free-solid-svg-icons';
import { TRACKS, PLATFORMS } from '../data/site';
import Card from './Card';
import NeonButton from './Button';
import { useLang } from '../i18n/LanguageContext';

// Keep the hero logo on the public asset path so the prerendered HTML and the
// hydrated client use the same URL in production.
const metallicLogo = '/icons/dhreian-logo-transparent-512.png';

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
      className="hero-banner relative min-h-screen lg:h-screen flex flex-col pt-32 md:pt-36 pb-12 md:pb-16 px-4 md:px-8 overflow-hidden bg-black"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-grow flex flex-col">

        <header className="hero-banner__header text-center mb-12 md:mb-16 flex-grow flex flex-col justify-end">
          <h1 className="sr-only">dhreian</h1>
          <img
            src={metallicLogo}
            width="512"
            height="512"
            alt="Logo de dhreian"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="hero-banner__logo mx-auto mb-3 h-auto w-36 object-contain md:mb-4 md:w-44 lg:w-52"
          />
          <p className="hero-banner__tagline font-body uppercase tracking-[0.3em] text-subtitle text-white font-medium">
            {t('hero.tagline')}
          </p>
        </header>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5 items-stretch">

          {featuredTrack && (
            <Card accent="purple" className="w-full">
              <div className="latest-release-ribbon" aria-label={t('hero.latest')}>
                <span aria-hidden="true">{t('hero.latest')}</span>
              </div>

              <div className="flex items-center h-full p-3 lg:p-4 gap-3 lg:gap-4">

                <div className="release-cover-recessed relative aspect-square w-[45%] shrink-0 overflow-hidden rounded-2xl">
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

                <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center gap-3 lg:gap-4">
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

                  <div className="flex gap-3 lg:gap-4 justify-center">
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
                        <FontAwesomeIcon icon={p.icon} fixedWidth className="block text-2xl lg:text-[1.75rem]" />
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
                <FontAwesomeIcon icon={faChevronLeft} />
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
                  <Card accent="subtle" className="h-full">
                    <div className="flex flex-col h-full p-2.5 lg:p-3 gap-2 justify-between">

                      <div className="release-cover-recessed aspect-square shrink-0 overflow-hidden rounded-2xl">
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

                      <div className="shrink-0 min-w-0 text-center">
                        <p className="font-body text-[clamp(1rem,1.1vw,1.125rem)] leading-[1.1] font-medium text-black normal-case tracking-[0.04em] text-center">
                          {track.mainArtist}
                        </p>
                        {track.featArtist && (
                          <p className="font-body text-[clamp(1rem,1.1vw,1.125rem)] leading-[1.1] font-medium text-black normal-case tracking-[0.04em] text-center">
                            ft. {track.featArtist}
                          </p>
                        )}
                        <h3 className="mt-0.5 w-full break-words text-center font-display lowercase text-[clamp(1.25rem,1.6vw,1.5rem)] leading-[1.05] tracking-tight">
                          <span className="text-purple-800">
                            {track.title.toLocaleLowerCase('es')}
                          </span>
                        </h3>
                      </div>

                      <div className="shrink-0 flex gap-1.5 lg:gap-2 justify-center">
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
                            <FontAwesomeIcon icon={p.icon} fixedWidth className="block text-base lg:text-lg" />
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
                <FontAwesomeIcon icon={faChevronRight} />
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

      <div className="metallic-divider-horizontal pointer-events-none absolute inset-x-0 bottom-0 w-full" />
    </section>
  );
}
