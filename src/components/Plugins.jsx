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
                <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-gradient-to-br from-zinc-900 to-black">
                  {plugin.image ? (
                    <img
                      src={plugin.image}
                      alt={`${t('plugins.imageAlt')} ${plugin.name}`}
                      width="800"
                      height="600"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full origin-center scale-100 transform-gpu object-contain p-6 transition-transform duration-700 ease-in-out will-change-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center">
                      <FontAwesomeIcon icon={faWaveSquare} className="text-zinc-700 text-5xl" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent pointer-events-none"></div>
                </div>

                <div className="p-7 flex flex-col flex-grow">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-2xl bg-purple-500/15 border border-purple-400/30 text-purple-200 font-body font-bold text-xs tracking-wider uppercase">
                      {plugin.type.toUpperCase()}
                    </span>
                    <div className="flex gap-1.5">
                      {plugin.formats.map((format) => (
                        <span
                          key={format}
                          className="px-2 py-1 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 font-body font-bold text-xs tracking-wider uppercase"
                        >
                          {format.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="font-display text-3xl text-white mb-1 group-hover:text-purple-200 transition-colors duration-300">
                    {plugin.name}
                  </h3>
                  <p className="font-body text-xs text-purple-300/80 uppercase tracking-[0.25em] font-semibold mb-4">
                    {t('plugins.developedBy')}
                  </p>
                  <p className="text-white text-sm leading-relaxed mb-7">
                    {t(`plugins.items.${plugin.key}.description`)}
                  </p>

                  <div className="mt-auto">
                    {plugin.comingSoon ? (
                      <div className="flex flex-col items-start gap-4">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-purple-500/15 border border-purple-400/30 text-purple-200 font-body text-xs font-semibold tracking-wider uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-neon-pulse"></span>
                          {t('plugins.soonBadge')}
                        </span>
                        <a
                          href="/contacto"
                          className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl border border-purple-500/50 bg-transparent text-white font-display lowercase text-xl tracking-wide transition-all duration-300 hover:border-purple-400 hover:bg-purple-900/20 hover:neon-glow-purple"
                        >
                          <span>{t('plugins.notify')}</span>
                          <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={`min-w-24 shrink-0 h-12 flex items-center justify-center px-3 rounded-2xl bg-zinc-800/50 border border-white/5 text-purple-200 font-body font-bold text-sm text-center truncate ${
                            plugin.free ? 'uppercase' : 'lowercase'
                          }`}
                        >
                          {plugin.free ? t('plugins.free') : plugin.price}
                        </div>
                        {isEmailDownload ? (
                          <button
                            type="button"
                            onClick={() => setSelectedPlugin(plugin)}
                            className="flex-1 h-12 flex items-center justify-center gap-2 rounded-2xl border border-purple-600 bg-purple-600 text-white font-display lowercase text-xl tracking-wide transition-all duration-300 hover:bg-purple-500 hover:border-purple-500 hover:neon-glow-purple cursor-pointer select-none"
                          >
                            <span>{t('plugins.download')}</span>
                            <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                          </button>
                        ) : (
                          <a
                            href={ctaHref}
                            {...(plugin.free && isExternal ? { download: true } : {})}
                            {...(isExternal && !plugin.free ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className="flex-1 h-12 flex items-center justify-center gap-2 rounded-2xl border border-purple-600 bg-purple-600 text-white font-display lowercase text-xl tracking-wide transition-all duration-300 hover:bg-purple-500 hover:border-purple-500 hover:neon-glow-purple"
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
