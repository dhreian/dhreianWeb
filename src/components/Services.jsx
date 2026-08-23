import React from 'react';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Section, SectionHeading } from './Section';
import NeonCard from './Card';
import IconBadge from './IconBadge';
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
            <div className="flex gap-6 flex-col sm:flex-row h-full">
              <IconBadge icon={service.icon} variant="purple" size="lg" />

              <div className="flex flex-col flex-1">
                <h3 className="font-display lowercase text-3xl text-white mb-3 group-hover:text-purple-200 transition-colors duration-300">
                  {t(`services.items.${service.key}.title`)}
                </h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  {t(`services.items.${service.key}.description`)}
                </p>
                <FeatureList items={t(`services.items.${service.key}.features`)} accent="purple" dense />

                <div className="mt-auto pt-6">
                  <div className="h-px w-full bg-gradient-to-r from-purple-500/40 via-purple-500/10 to-transparent mb-4"></div>
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <span className="font-body text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-semibold">
                      {t('services.priceLabel')}
                    </span>
                    <span className="font-body font-bold text-lg text-purple-200 tracking-wide whitespace-nowrap group-hover:neon-text-purple transition-all duration-300">
                      {service.price}
                    </span>
                  </div>
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
