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
      className="bg-zinc-950"
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
                className="liquid-glass-card group flex flex-row items-center gap-3 rounded-2xl border border-purple-500 p-3 text-left transition-colors duration-300 hover:border-purple-500 sm:gap-6 sm:p-4"
              >
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-32">
                  <img
                    src={track.cover}
                    width="600"
                    height="600"
                    alt={`Carátula de ${track.title}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow min-w-0 flex flex-col items-start gap-1.5 sm:gap-2.5">
                  <p className="font-body text-label font-medium text-zinc-600 uppercase tracking-widest w-full truncate">
                    <span className="text-purple-800">{track.mainArtist}</span>
                    {track.featArtist && (
                      <>
                        <span className="text-zinc-500 mx-1.5 lowercase font-normal">ft.</span>
                        <span className="text-zinc-700">{track.featArtist}</span>
                      </>
                    )}
                  </p>

                  <h4 className="font-display lowercase text-card-compact text-zinc-950 pb-0.5 w-full truncate group-hover:text-purple-800 transition-colors">
                    {track.title}
                  </h4>

                  <div className="flex flex-wrap justify-start gap-1.5 sm:gap-2">
                    {filteredTags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center gap-1.5 rounded-2xl border px-3 py-1 text-label font-semibold uppercase tracking-wider transition-colors duration-300 ${TRACK_TAG_STYLES[tag]}`}
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
                      className={`liquid-glass-button grid h-8 w-8 place-items-center rounded-full border border-black bg-white text-black transition-colors duration-300 sm:h-12 sm:w-12 ${p.hoverClass || 'hover:border-purple-500 hover:text-purple-500'}`}
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
