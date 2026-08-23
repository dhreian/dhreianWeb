import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faSliders } from '@fortawesome/free-solid-svg-icons';
import { TRACKS, PLATFORMS } from '../data/site';
import Card from './Card';
import NeonButton from './Button';
import { useLang } from '../i18n/LanguageContext';

export default function Hero() {
  const { t } = useLang();
  const featuredTrack = TRACKS[0];
  const otherTracks = TRACKS.slice(1);

  return (
    <section
      id="portfolio"
      className="hero-banner relative min-h-screen lg:h-screen flex flex-col pt-32 md:pt-36 pb-12 md:pb-16 px-4 md:px-8 overflow-hidden bg-black"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black/60 to-black pointer-events-none" />

      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-[120px] animate-neon-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-fuchsia-600/15 rounded-full blur-[120px] animate-neon-pulse pointer-events-none" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex-grow flex flex-col">

        <header className="hero-banner__header text-center mb-12 md:mb-16 flex-grow flex flex-col justify-end">
          <h1 className="hero-banner__title font-display lowercase text-6xl sm:text-7xl md:text-8xl lg:text-8xl tracking-tight leading-none">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-purple-500 to-fuchsia-500 neon-text-purple">
              dhreian
            </span>
          </h1>
          <p className="hero-banner__tagline mt-4 md:mt-5 font-body uppercase tracking-[0.3em] text-purple-200/90 text-sm sm:text-base md:text-lg font-medium">
            {t('hero.tagline')}
          </p>
          <p className="hero-banner__copy text-zinc-400 text-sm md:text-base max-w-2xl mx-auto mt-5 font-light leading-relaxed">
            {t('hero.taglineRest')}
            <br />
            <strong className="font-semibold text-zinc-200">{t('hero.listen')}</strong>
          </p>
        </header>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5 items-stretch">

          {featuredTrack && (
            <Card accent="purple" className="w-full">
              <div className="flex items-stretch p-3 lg:p-4 gap-3 lg:gap-4">

                <div className="w-[45%] aspect-square shrink-0 rounded-2xl overflow-hidden shadow-[0_0_45px_rgba(138,108,255,0.25)] relative group">
                  <img
                    src={featuredTrack.cover}
                    alt={`${t('hero.coverOf')} ${featuredTrack.title}`}
                    width="600"
                    height="600"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 shadow-[inset_0_0_25px_rgba(0,0,0,0.45)] pointer-events-none" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center gap-3 lg:gap-4">

                  <span className="inline-flex items-center whitespace-nowrap text-[10px] lg:text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 neon-text-fuchsia">
                    {t('hero.latest')}
                  </span>

                  <h2 className="font-display lowercase text-white text-3xl lg:text-4xl xl:text-5xl leading-[0.95] neon-text-fuchsia w-full break-words">
                    {featuredTrack.title.split(' ').map((word, i) => (
                      <span key={i} className="block">{word}</span>
                    ))}
                  </h2>

                  <p className="font-body text-sm lg:text-base font-bold text-zinc-300 uppercase tracking-[0.15em] leading-tight w-full">
                    {featuredTrack.mainArtist}
                    {featuredTrack.featArtist && ` feat. ${featuredTrack.featArtist}`}
                  </p>

                  <div className="flex gap-3 lg:gap-4 justify-center">
                    {PLATFORMS.map((p) => (
                      <a
                        key={p.key}
                        href={featuredTrack.links[p.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${t('hero.listenOn')} ${p.title}`}
                        className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white grid place-items-center leading-none transition-all duration-300 shadow-[0_0_16px_rgba(0,0,0,0.25)] ${p.hoverClass}`}
                      >
                        <FontAwesomeIcon icon={p.icon} fixedWidth className="block text-xl lg:text-2xl" />
                      </a>
                    ))}
                  </div>

                </div>
              </div>
            </Card>
          )}

          <div className="flex flex-col min-w-0">

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 flex-grow min-h-0">
              {otherTracks.map((track, idx) => (
                <Card key={idx} accent="subtle" className="h-full">
                  <div className="flex flex-col h-full p-2.5 lg:p-3 gap-2 justify-between">

                    <div className="aspect-square shrink-0 rounded-2xl overflow-hidden border border-white/5 shadow-[0_0_8px_rgba(0,0,0,0.25)]">
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
                      <p className="font-body text-[9px] lg:text-[10px] font-bold text-purple-300 uppercase tracking-widest truncate">
                        {track.mainArtist}
                      </p>
                      <h3 className="font-display lowercase text-sm lg:text-base text-white truncate group-hover:text-purple-300 transition-colors">
                        {track.title}
                      </h3>
                    </div>

                    <div className="shrink-0 flex gap-1.5 lg:gap-2 justify-center">
                      {PLATFORMS.map((p) => (
                        <a
                          key={p.key}
                          href={track.links[p.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${t('hero.listenOn')} ${p.title}`}
                          className={`w-9 h-9 lg:w-10 lg:h-10 shrink-0 rounded-full border border-white/5 text-zinc-400 hover:text-white grid place-items-center leading-none transition-all duration-300 ${p.hoverClass || 'hover:bg-purple-500/10'}`}
                        >
                          <FontAwesomeIcon icon={p.icon} fixedWidth className="block text-base lg:text-lg" />
                        </a>
                      ))}
                    </div>

                  </div>
                </Card>
              ))}
            </div>
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

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 md:w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent pointer-events-none" />
    </section>
  );
}
