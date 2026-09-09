import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Section, SectionHeading } from './Section';
import NeonCard from './Card';
import FeatureList from './FeatureList';
import { SERVICES } from '../data/site';
import { useLang } from '../i18n/LanguageContext';

import NeonButton from './Button';

export default function Services() {
  const { t } = useLang();

  return (
    <Section id="servicios" divider={true} dividerAccent="purple" glow={true} glowAccent="purple">
      <SectionHeading
        eyebrow={t('services.eyebrow')}
        title={t('services.title')}
        subtitle={t('services.subtitle')}
      />

      <div className="grid md:grid-cols-2 gap-8">
        {SERVICES.map((service) => (
          <NeonCard key={service.key} accent="subtle" className="p-8 md:p-10">
            <div className="flex h-full flex-col">
              <div className="service-gothic-icon" aria-hidden="true">
                <FontAwesomeIcon icon={service.icon} fixedWidth />
              </div>

              <h3 className="font-display lowercase text-card text-black mb-3 group-hover:text-purple-800 transition-colors duration-300">
                {t(`services.items.${service.key}.title`)}
              </h3>
              <p className="text-black text-body mb-6">
                {t(`services.items.${service.key}.description`)}
              </p>
              <FeatureList items={t(`services.items.${service.key}.features`)} accent="purple" dense />

              <div className="mt-auto pt-6">
                <div className="mb-4 h-px w-full bg-purple-500"></div>
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <span className="font-body text-label uppercase tracking-[0.25em] text-black font-medium">
                    {t('services.priceLabel')}
                  </span>
                  <span className="font-body font-semibold text-price text-purple-800 tracking-wide whitespace-nowrap transition-colors duration-300 group-hover:text-purple-950">
                    {service.price}
                  </span>
                </div>
              </div>
            </div>
          </NeonCard>
        ))}
      </div>

      <div className="mt-10 md:mt-12 flex justify-center">
        <NeonButton href="/contacto" variant="primary" size="md" icon={faPaperPlane}>
          {t('services.cta')}
        </NeonButton>
      </div>
    </Section>
  );
}
