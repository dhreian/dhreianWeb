import React, { useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faDownload, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Section, SectionHeading } from './Section';
import Card from './Card';
import NeonButton from './Button';
import PluginDownloadModal from './PluginDownloadModal';
import { WEB_TOOLS } from '../data/site';
import { useLang } from '../i18n/LanguageContext';

export default function WebTools() {
  const { t } = useLang();
  const [selectedTool, setSelectedTool] = useState(null);
  const closeDownloadModal = useCallback(() => setSelectedTool(null), []);

  return (
    <Section
      id="herramientas"
      divider={true}
      dividerAccent="purple"
      glow={true}
      glowAccent="purple"
    >
      <SectionHeading
        eyebrow={t('webtools.eyebrow')}
        title={t('webtools.title')}
        subtitle={t('webtools.subtitle')}
        accent="purple"
      />

      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {WEB_TOOLS.map((tool) => (
          <Card key={tool.key} accent="purple" className="w-full max-w-sm">
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
                    className={`h-full w-full origin-center scale-100 transform-gpu object-contain transition-transform duration-700 ease-in-out will-change-transform group-hover:scale-105 ${
                      tool.type === 'desktopApp' ? 'p-6' : ''
                    }`}
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center">
                    <FontAwesomeIcon icon={faGlobe} className="text-5xl text-zinc-700" />
                  </div>
                )}
                <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
              </div>

              <div className="flex flex-grow flex-col p-7">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-2xl border border-purple-400/30 bg-purple-500/15 px-2.5 py-1 font-body text-xs font-bold uppercase tracking-wider text-purple-200">
                    {t(`webtools.${tool.type}`)}
                  </span>
                  {tool.formats && (
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {tool.formats.map((format) => (
                        <span
                          key={format}
                          className="rounded-2xl border border-white/10 bg-white/5 px-2 py-1 font-body text-xs font-bold uppercase tracking-wider text-zinc-400"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <h3 className="mb-1 font-display text-3xl text-white transition-colors duration-300 group-hover:text-purple-200">
                  {tool.name}
                </h3>
                <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.25em] text-purple-300/80">
                  {t('webtools.developedBy')}
                </p>
                <p className="mb-7 text-sm leading-relaxed text-white">
                  {t(`webtools.items.${tool.key}.description`)}
                </p>

                <div className="mt-auto w-full">
                  {tool.downloadByEmail ? (
                    <div className="flex w-full items-center gap-3">
                      <div className="flex h-12 min-w-24 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-zinc-800/50 px-3 text-center font-body text-sm font-bold uppercase text-purple-200">
                        {t('webtools.free')}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedTool(tool)}
                        className="flex h-12 flex-1 cursor-pointer select-none items-center justify-center gap-2 rounded-2xl border border-purple-600 bg-purple-600 font-display text-xl lowercase tracking-wide text-white transition-all duration-300 hover:border-purple-500 hover:bg-purple-500 hover:neon-glow-purple"
                        aria-label={`${t('webtools.download')} ${tool.name}`}
                      >
                        <span>{t('webtools.download')}</span>
                        <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <NeonButton
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t('webtools.cta')} ${tool.name}`}
                      variant="primary"
                      size="md"
                      icon={faArrowUpRightFromSquare}
                      className="h-12 w-full px-4 py-0 text-lg"
                    >
                      {t('webtools.cta')}
                    </NeonButton>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedTool && (
        <PluginDownloadModal plugin={selectedTool} onClose={closeDownloadModal} />
      )}
    </Section>
  );
}
