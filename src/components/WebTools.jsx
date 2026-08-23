import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Section, SectionHeading } from './Section';
import Card from './Card';
import NeonButton from './Button';
import { WEB_TOOLS } from '../data/site';
import { useLang } from '../i18n/LanguageContext';

export default function WebTools() {
  const { t } = useLang();

  return (
    <Section
      id="herramientas"
      divider={true}
      dividerAccent="fuchsia"
      glow={true}
      glowAccent="fuchsia"
    >
      <SectionHeading
        eyebrow={t('webtools.eyebrow')}
        title={t('webtools.title')}
        subtitle={t('webtools.subtitle')}
        accent="fuchsia"
      />

      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {WEB_TOOLS.map((tool) => (
          <Card key={tool.key} accent="fuchsia" className="w-full max-w-sm">
            <div className="flex h-full flex-col">
              <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-gradient-to-br from-zinc-900 to-black">
                {tool.image ? (
                  <img
                    src={tool.image}
                    alt={`${t('webtools.imageAlt')} ${tool.name}`}
                    width="1920"
                    height="1080"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center">
                    <FontAwesomeIcon icon={faGlobe} className="text-5xl text-zinc-700" />
                  </div>
                )}
                <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent" />
              </div>

              <div className="flex flex-grow flex-col p-7">
                <div className="mb-4 flex items-center">
                  <span className="rounded-2xl border border-fuchsia-400/30 bg-fuchsia-500/15 px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-fuchsia-200">
                    {t('webtools.webApp')}
                  </span>
                </div>

                <h3 className="mb-1 font-display text-3xl text-white transition-colors duration-300 group-hover:text-fuchsia-200">
                  {tool.name}
                </h3>
                <p className="mb-4 font-body text-[10px] font-semibold uppercase tracking-[0.25em] text-fuchsia-300/80">
                  {t('webtools.developedBy')}
                </p>
                <p className="mb-7 text-sm leading-relaxed text-zinc-400">
                  {t(`webtools.items.${tool.key}.description`)}
                </p>

                <div className="mt-auto w-full">
                  <NeonButton
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t('webtools.cta')} ${tool.name}`}
                    variant="fuchsia"
                    size="md"
                    icon={faArrowUpRightFromSquare}
                    className="h-12 w-full px-4 py-0 text-lg"
                  >
                    {t('webtools.cta')}
                  </NeonButton>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
