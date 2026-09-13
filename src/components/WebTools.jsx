import React, { useCallback, useState } from 'react';
import { faArrowUpFromBracket, faCircleInfo, faDownload, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Section, SectionHeading } from './Section';
import Card from './Card';
import NeonButton from './Button';
import PluginDownloadModal from './PluginDownloadModal';
import VersionHistoryModal from './VersionHistoryModal';
import { WEB_TOOLS } from '../data/site';
import { useLang } from '../i18n/LanguageContext';
import GothicIcon from './GothicIcon';

export default function WebTools() {
  const { t } = useLang();
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedVersionProduct, setSelectedVersionProduct] = useState(null);
  const closeDownloadModal = useCallback(() => setSelectedTool(null), []);
  const closeVersionHistory = useCallback(() => setSelectedVersionProduct(null), []);

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
                    <GothicIcon icon={faGlobe} size="empty" className="text-zinc-600" />
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

                <h3 className="mb-1 font-title text-card text-white transition-colors duration-300 group-hover:text-purple-300">
                  {tool.name}
                </h3>
                <p className="mb-4 font-body text-label font-medium uppercase tracking-[0.25em] text-purple-300">
                  {t('webtools.developedBy')}
                </p>
                <p className="mb-7 text-body text-zinc-300">
                  {t(`webtools.items.${tool.key}.description`)}
                </p>

                <div className="mt-auto w-full">
                  {tool.downloadByEmail ? (
                    <div className="flex w-full items-center gap-2">
                      <div className="secondary-action-label flex h-[3.25rem] min-w-20 shrink-0 items-center justify-center px-3 text-center lowercase">
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
                        className="min-w-0 flex-1 !px-4"
                        aria-label={`${t('webtools.download')} ${tool.name}`}
                      >
                        {t('webtools.download')}
                      </NeonButton>
                      {tool.key !== 'aurolab' && tool.versions?.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedVersionProduct(tool)}
                          className="liquid-glass-button primary-action-button primary-action-button--on-light primary-action-button--icon shrink-0 cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                          aria-label={`${t('versions.infoLabel')} ${tool.name}`}
                          title={`${t('versions.infoLabel')} ${tool.name}`}
                        >
                          <GothicIcon icon={faCircleInfo} size="button" />
                        </button>
                      )}
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
                      icon={faArrowUpFromBracket}
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
      {selectedVersionProduct && (
        <VersionHistoryModal product={selectedVersionProduct} onClose={closeVersionHistory} />
      )}
    </Section>
  );
}
