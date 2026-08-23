import React, { useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faBell, faDownload, faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import { Section, SectionHeading } from './Section';
import Card from './Card';
import PluginDownloadModal from './PluginDownloadModal';
import { PLUGINS } from '../data/site';
import { useLang } from '../i18n/LanguageContext';

export default function Plugins() {
  const { t } = useLang();
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const closeDownloadModal = useCallback(() => setSelectedPlugin(null), []);

  return (
    <Section id="plugins" divider={true} dividerAccent="fuchsia" glow={true} glowAccent="fuchsia">
      <SectionHeading
        eyebrow={t('plugins.eyebrow')}
        title={t('plugins.title')}
        subtitle={t('plugins.subtitle')}
        accent="fuchsia"
      />

      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {PLUGINS.map((plugin) => {
          const ctaHref =
            plugin.url ||
            `mailto:contact@dhreian.com?subject=${encodeURIComponent(plugin.name)}`;
          const isExternal = Boolean(plugin.url);
          const isEmailDownload = plugin.free && plugin.downloadByEmail;

          return (
            <Card key={plugin.key} accent="fuchsia" className="w-full max-w-sm">
              <div className="flex flex-col h-full">
                <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-zinc-900 to-black overflow-hidden shrink-0">
                  {plugin.image ? (
                    <img
                      src={plugin.image}
                      alt={`${t('plugins.imageAlt')} ${plugin.name}`}
                      width="800"
                      height="600"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center">
                      <FontAwesomeIcon icon={faWaveSquare} className="text-zinc-700 text-5xl" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent pointer-events-none"></div>
                </div>

                <div className="p-7 flex flex-col flex-grow">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-400/30 text-fuchsia-200 font-body font-bold text-[10px] tracking-wider uppercase">
                      {plugin.type.toUpperCase()}
                    </span>
                    <div className="flex gap-1.5">
                      {plugin.formats.map((format) => (
                        <span
                          key={format}
                          className="px-2 py-1 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 font-body font-bold text-[10px] tracking-wider uppercase"
                        >
                          {format.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="font-display text-3xl text-white mb-1 group-hover:text-fuchsia-200 transition-colors duration-300">
                    {plugin.name}
                  </h3>
                  <p className="font-body text-[10px] text-fuchsia-300/80 uppercase tracking-[0.25em] font-semibold mb-4">
                    {t('plugins.developedBy')}
                  </p>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-7">
                    {t(`plugins.items.${plugin.key}.description`)}
                  </p>

                  <div className="mt-auto">
                    {plugin.comingSoon ? (
                      <div className="flex flex-col items-start gap-4">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-400/30 text-fuchsia-200 font-body text-xs font-semibold tracking-wider uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-neon-pulse"></span>
                          {t('plugins.soonBadge')}
                        </span>
                        <a
                          href="/contacto"
                          className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl border border-fuchsia-500/50 bg-transparent text-white font-display lowercase text-lg transition-all duration-300 hover:border-fuchsia-400 hover:bg-fuchsia-900/20 hover:neon-glow-fuchsia"
                        >
                          <span>{t('plugins.notify')}</span>
                          <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={`min-w-24 shrink-0 h-12 flex items-center justify-center px-3 rounded-2xl bg-zinc-800/50 border border-white/5 text-fuchsia-200 font-body font-bold text-sm text-center truncate ${
                            plugin.free ? 'uppercase' : 'lowercase'
                          }`}
                        >
                          {plugin.free ? t('plugins.free') : plugin.price}
                        </div>
                        {isEmailDownload ? (
                          <button
                            type="button"
                            onClick={() => setSelectedPlugin(plugin)}
                            className="flex-1 h-12 flex items-center justify-center gap-2 rounded-2xl border border-fuchsia-600 bg-fuchsia-600 text-white font-display lowercase text-lg transition-all duration-300 hover:bg-fuchsia-500 hover:border-fuchsia-500 hover:neon-glow-fuchsia cursor-pointer select-none"
                          >
                            <span>{t('plugins.download')}</span>
                            <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                          </button>
                        ) : (
                          <a
                            href={ctaHref}
                            {...(plugin.free && isExternal ? { download: true } : {})}
                            {...(isExternal && !plugin.free ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className="flex-1 h-12 flex items-center justify-center gap-2 rounded-2xl border border-fuchsia-600 bg-fuchsia-600 text-white font-display lowercase text-lg transition-all duration-300 hover:bg-fuchsia-500 hover:border-fuchsia-500 hover:neon-glow-fuchsia"
                          >
                            <span>{plugin.free ? t('plugins.download') : t('plugins.buy')}</span>
                            <FontAwesomeIcon icon={plugin.free ? faDownload : faArrowUpRightFromSquare} className="w-4 h-4" />
                          </a>
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
