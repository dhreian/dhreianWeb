import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Section, SectionHeading } from './Section';
import { TRACKS, TRACK_TAG_ICONS, TRACK_TAG_STYLES, PLATFORMS } from '../data/site';

export default function Discography() {
  const getFilteredTags = (tags) => {
    if (tags.includes('prod')) {
      return tags.filter(t => t === 'prod' || (!['beatmaker', 'mezcla', 'mastering'].includes(t)));
    }
    return tags;
  };

  return (
    <Section
      id="portfolio"
      className="bg-zinc-950/40"
      divider={true}
      glow={true}
    >

        <SectionHeading
          eyebrow="portafolio"
          title="discografía"
          subtitle="Trabajos recientes de producción, beatmaking, mezcla y mastering."
        />

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {TRACKS.map((track, idx) => {
            const filteredTags = getFilteredTags(track.tags);

            return (
              <article
                key={idx}
                className="group flex flex-row items-center text-left gap-3 sm:gap-6 p-3 sm:p-4 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-800/60 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                  <img
                    src={track.cover}
                    width="600"
                    height="600"
                    alt={`Carátula de ${track.title}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex-grow min-w-0 flex flex-col items-start gap-1.5 sm:gap-2.5">
                  <p className="font-body text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-widest w-full truncate">
                    <span className="text-purple-300">{track.mainArtist}</span>
                    {track.featArtist && (
                      <>
                        <span className="text-zinc-500 mx-1.5 lowercase font-semibold">ft.</span>
                        <span className="text-zinc-300">{track.featArtist}</span>
                      </>
                    )}
                  </p>

                  <h4 className="font-display lowercase text-2xl sm:text-3xl text-white leading-snug sm:leading-normal pb-0.5 w-full truncate group-hover:text-purple-300 transition-colors">
                    {track.title}
                  </h4>

                  <div className="flex flex-wrap justify-start gap-1.5 sm:gap-2">
                    {filteredTags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center gap-1.5 text-xs sm:text-sm px-3 py-1 rounded-2xl border font-bold uppercase tracking-wider shadow-sm transition-all duration-300 ${TRACK_TAG_STYLES[tag]}`}
                      >
                        <FontAwesomeIcon icon={TRACK_TAG_ICONS[tag]} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center shrink-0">
                  {PLATFORMS.map(p => (
                    <a
                      key={p.key}
                      href={track.links[p.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-white/10 text-zinc-400 grid place-items-center transition-all duration-300 ${p.hoverClass || 'hover:text-purple-300 hover:border-purple-400/50 hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(138,108,255,0.4)]'}`}
                      title={`Escuchar en ${p.title}`}
                    >
                      <FontAwesomeIcon icon={p.icon} className="text-sm sm:text-lg" fixedWidth />
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

    </Section>
  );
}
