import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faFileContract,
  faBoltLightning,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { Section, SectionHeading } from './Section';
import NeonButton from './Button';
import Card from './Card';
import Catalog from './Catalog';
import { useLang } from '../i18n/LanguageContext';

const BEATSTARS_EMBED_URL = null;
const BEATSTARS_PRO_PAGE = 'https://www.beatstars.com/dhreian';

const STEP_ICONS = [faMagnifyingGlass, faArrowUpRightFromSquare, faFileContract, faBoltLightning];

export default function BeatStore() {
  const { t } = useLang();
  const hasEmbed = Boolean(BEATSTARS_EMBED_URL);
  const steps = t('beatstore.steps');

  return (
    <Section id="beats" divider={true} dividerAccent="fuchsia" glow={true} glowAccent="fuchsia">
      <SectionHeading
        eyebrow={t('beatstore.eyebrow')}
        title={t('beatstore.title')}
        subtitle={t('beatstore.subtitle')}
      />

      <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 md:mb-16">
            {steps.map((step, idx) => (
              <Card
                key={idx}
                accent="subtle"
                interactive={false}
                className="p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-display text-purple-400/60 text-2xl">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-purple-500/40 to-transparent"></span>
                  <FontAwesomeIcon
                    icon={STEP_ICONS[idx]}
                    className="text-purple-400"
                  />
                </div>
                <h3 className="font-display lowercase text-lg text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{step.description}</p>
              </Card>
            ))}
          </div>

          {hasEmbed ? (
            <div className="relative w-full aspect-video md:aspect-[16/10] bg-zinc-900/80 rounded-2xl border border-purple-500/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden">
              <iframe
                src={BEATSTARS_EMBED_URL}
                title="dhreian — BeatStars catalog"
                className="absolute inset-0 w-full h-full"
                allow="autoplay; clipboard-write; encrypted-media"
                loading="lazy"
              />
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent pointer-events-none"></div>
            </div>
          ) : (
            <Catalog />
          )}

          <div className="mt-12 md:mt-16 flex flex-col items-center gap-3">
            <NeonButton
              href={BEATSTARS_PRO_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="md"
              icon={faArrowUpRightFromSquare}
            >
              {t('beatstore.cta')}
            </NeonButton>
          </div>
      </div>
    </Section>
  );
}
