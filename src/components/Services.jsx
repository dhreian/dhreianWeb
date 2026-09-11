import React, { useId } from 'react';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Section, SectionHeading } from './Section';
import NeonCard from './Card';
import FeatureList from './FeatureList';
import GothicIcon from './GothicIcon';
import { SERVICES } from '../data/site';
import { useLang } from '../i18n/LanguageContext';

import NeonButton from './Button';

function ServiceMoon({ icon }) {
  const metalGradientId = `service-icon-metal-${useId().replace(/:/g, '')}`;

  return (
    <div className="service-gothic-icon" aria-hidden="true">
      <span className="service-gothic-icon-moon">
        <svg className="section-title-metal-defs" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id={metalGradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="16%" stopColor="#b8afc0" />
              <stop offset="34%" stopColor="#3a3342" />
              <stop offset="49%" stopColor="#fbf9ff" />
              <stop offset="65%" stopColor="#706677" />
              <stop offset="82%" stopColor="#e8e3ed" />
              <stop offset="100%" stopColor="#51465c" />
            </linearGradient>
          </defs>
        </svg>
        <GothicIcon
          icon={icon}
          size="badge"
          className="service-gothic-icon-symbol"
          style={{ '--service-icon-metal-fill': `url(#${metalGradientId})` }}
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
          <NeonCard key={service.key} accent="subtle" className="p-8 md:p-10">
            <div className="flex h-full flex-col">
              <ServiceMoon icon={service.icon} />

              <h3 className="mb-3 pr-16 font-display lowercase text-card text-black transition-colors duration-300 group-hover:text-purple-800 md:pr-24">
                {t(`services.items.${service.key}.title`)}
              </h3>
              <p className="text-black text-body mb-6">
                {t(`services.items.${service.key}.description`)}
              </p>
              <FeatureList items={t(`services.items.${service.key}.features`)} accent="purple" dense />

              <div className="mt-auto pt-6">
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
