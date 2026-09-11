import React, { useCallback, useState } from 'react';
import { faArrowUpFromBracket, faBell, faDownload, faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import { Section, SectionHeading } from './Section';
import Card from './Card';
import NeonButton from './Button';
import PluginDownloadModal from './PluginDownloadModal';
import { PLUGINS } from '../data/site';
import { useLang } from '../i18n/LanguageContext';
import GothicIcon from './GothicIcon';

export default function Plugins() {
  const { t } = useLang();
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const closeDownloadModal = useCallback(() => setSelectedPlugin(null), []);

  return (
    <Section id="plugins" divider={true} glow={true}>
      <SectionHeading
        eyebrow={t('plugins.eyebrow')}
        title={t('plugins.title')}
        subtitle={t('plugins.subtitle')}
      />

      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {PLUGINS.map((plugin) => {
          const ctaHref =
            plugin.url ||
            `mailto:contact@dhreian.com?subject=${encodeURIComponent(plugin.name)}`;
          const isExternal = Boolean(plugin.url);
          const isEmailDownload = plugin.free && plugin.downloadByEmail;

          return (
            <Card key={plugin.key} accent="purple" className="w-full max-w-sm">
              <div className="flex flex-col h-full">
                <div className="card-media-frame relative aspect-video shrink-0 overflow-hidden">
                  {plugin.image ? (
                    <img
                      src={plugin.image}
                      alt={`${t('plugins.imageAlt')} ${plugin.name}`}
                      width="800"
                      height="600"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center">
                      <GothicIcon icon={faWaveSquare} size="empty" className="text-zinc-700" />
                    </div>
                  )}
                </div>

                <div className="p-7 flex flex-col flex-grow">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="metallic-purple-badge rounded-2xl border px-2.5 py-1 font-body text-label font-semibold uppercase tracking-wider">
                      {plugin.type.toUpperCase()}
                    </span>
                    <div className="flex gap-1.5">
                      {plugin.formats.map((format) => (
                        <span
                          key={format}
                          className="metallic-dark-badge rounded-2xl border px-2 py-1 font-body text-label font-semibold uppercase tracking-wider"
                        >
                          {format.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="font-display text-card text-black mb-1 group-hover:text-purple-800 transition-colors duration-300">
                    {plugin.name}
                  </h3>
                  <p className="font-body text-label text-purple-700 uppercase tracking-[0.25em] font-medium mb-4">
                    {t('plugins.developedBy')}
                  </p>
                  <p className="text-black text-body mb-7">
                    {t(`plugins.items.${plugin.key}.description`)}
                  </p>

                  <div className="mt-auto">
                    {plugin.comingSoon ? (
                      <div className="flex flex-col items-start gap-4">
                        <span className="metallic-purple-badge inline-flex items-center gap-2 rounded-2xl border px-3.5 py-1.5 font-body text-label font-medium uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-neon-pulse"></span>
                          {t('plugins.soonBadge')}
                        </span>
                        <a
                          href="/contacto"
                          className="metallic-control liquid-glass-button flex h-12 w-full items-center justify-center gap-2 rounded-2xl border font-display text-button-sm lowercase tracking-wide text-black transition-colors duration-300"
                        >
                          <span>{t('plugins.notify')}</span>
                          <GothicIcon icon={faBell} size="button" />
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className="secondary-action-label flex h-[3.25rem] min-w-24 shrink-0 items-center justify-center truncate px-3 text-center lowercase"
                        >
                          {plugin.free ? t('plugins.free') : plugin.price}
                        </div>
                        {isEmailDownload ? (
                          <NeonButton
                            as="button"
                            type="button"
                            onClick={() => setSelectedPlugin(plugin)}
                            variant="primary"
                            surface="light"
                            size="md"
                            icon={faDownload}
                            className="flex-1"
                          >
                            {t('plugins.download')}
                          </NeonButton>
                        ) : (
                          <NeonButton
                            href={ctaHref}
                            {...(plugin.free && isExternal ? { download: true } : {})}
                            {...(isExternal && !plugin.free ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            variant="primary"
                            surface="light"
                            size="md"
                            icon={plugin.free ? faDownload : faArrowUpFromBracket}
                            className="flex-1"
                          >
                            {plugin.free ? t('plugins.download') : t('plugins.buy')}
                          </NeonButton>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedPlugin && (
        <PluginDownloadModal plugin={selectedPlugin} onClose={closeDownloadModal} />
      )}
    </Section>
  );
}
