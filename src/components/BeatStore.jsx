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
    <Section id="beats" divider={true} glow={true}>
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
                  <span className="font-display text-card-compact text-purple-500">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="h-px flex-1 bg-purple-500"></span>
                  <FontAwesomeIcon
                    icon={STEP_ICONS[idx]}
                    className="text-purple-700"
                  />
                </div>
                <h3 className="font-body font-medium lowercase text-card-compact text-purple-950 mb-1">
                  {step.title}
                </h3>
                <p className="text-body-compact text-black">{step.description}</p>
              </Card>
            ))}
          </div>

          {hasEmbed ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-purple-500 bg-zinc-900 md:aspect-[16/10]">
              <iframe
                src={BEATSTARS_EMBED_URL}
                title="dhreian — BeatStars catalog"
                className="absolute inset-0 w-full h-full"
                allow="autoplay; clipboard-write; encrypted-media"
                loading="lazy"
              />
              <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-purple-500"></div>
              <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-purple-500"></div>
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
