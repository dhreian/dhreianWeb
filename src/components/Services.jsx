import React from 'react';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Section, SectionHeading } from './Section';
import NeonCard from './Card';
import FeatureList from './FeatureList';
import GothicIcon from './GothicIcon';
import { SERVICES } from '../data/site';
import { useLang } from '../i18n/LanguageContext';

import NeonButton from './Button';

function ServiceMoon({ icon }) {
  return (
    <div className="service-gothic-icon" aria-hidden="true">
      <span className="service-gothic-icon-moon">
        <GothicIcon
          icon={icon}
          size="badge"
          className="service-gothic-icon-symbol"
        />
      </span>
    </div>
  );
}

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
          <NeonCard key={service.key} accent="subtle" className="service-card p-8 md:p-10">
            <div className="flex h-full flex-col">
              <ServiceMoon icon={service.icon} />

              <h3 className="service-card__title mb-3 pr-16 font-title lowercase text-card md:pr-24">
                {t(`services.items.${service.key}.title`)}
              </h3>
              <p className="service-card__description text-body mb-6">
                {t(`services.items.${service.key}.description`)}
              </p>
              <FeatureList items={t(`services.items.${service.key}.features`)} accent="purple" dense />

              <div className="mt-auto pt-6">
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <span className="service-card__price-label font-body text-label uppercase tracking-[0.25em] font-medium">
                    {t('services.priceLabel')}
                  </span>
                  <span className="service-card__price font-body font-semibold text-price tracking-wide whitespace-nowrap">
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
