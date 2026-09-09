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
              <div className="card-media-frame relative aspect-video shrink-0 overflow-hidden">
                {tool.image ? (
                  <img
                    src={tool.image}
                    alt={`${t('webtools.imageAlt')} ${tool.name}`}
                    width="1920"
                    height="1080"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center">
                    <FontAwesomeIcon icon={faGlobe} className="text-5xl text-zinc-700" />
                  </div>
                )}
              </div>

              <div className="flex flex-grow flex-col p-7">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="metallic-purple-badge rounded-2xl border px-2.5 py-1 font-body text-label font-semibold uppercase tracking-wider">
                    {t(`webtools.${tool.type}`)}
                  </span>
                  {tool.formats && (
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {tool.formats.map((format) => (
                        <span
                          key={format}
                          className="metallic-dark-badge rounded-2xl border px-2 py-1 font-body text-label font-semibold uppercase tracking-wider"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <h3 className="mb-1 font-display text-card text-black transition-colors duration-300 group-hover:text-purple-800">
                  {tool.name}
                </h3>
                <p className="mb-4 font-body text-label font-medium uppercase tracking-[0.25em] text-purple-700">
                  {t('webtools.developedBy')}
                </p>
                <p className="mb-7 text-body text-black">
                  {t(`webtools.items.${tool.key}.description`)}
                </p>

                <div className="mt-auto w-full">
                  {tool.downloadByEmail ? (
                    <div className="flex w-full items-center gap-3">
                      <div className="secondary-action-label flex h-[3.25rem] min-w-24 shrink-0 items-center justify-center px-3 text-center lowercase">
                        {t('webtools.free')}
                      </div>
                      <NeonButton
                        as="button"
                        type="button"
                        onClick={() => setSelectedTool(tool)}
                        variant="primary"
                        surface="light"
                        size="md"
                        icon={faDownload}
                        className="flex-1"
                        aria-label={`${t('webtools.download')} ${tool.name}`}
                      >
                        {t('webtools.download')}
                      </NeonButton>
                    </div>
                  ) : (
                    <NeonButton
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t('webtools.cta')} ${tool.name}`}
                      variant="primary"
                      surface="light"
                      size="md"
                      icon={faArrowUpRightFromSquare}
                      className="w-full"
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
