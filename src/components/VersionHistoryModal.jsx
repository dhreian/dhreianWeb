import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Card from './Card';
import GothicIcon from './GothicIcon';
import { useLang } from '../i18n/LanguageContext';

function compareVersions(left, right) {
  const leftParts = String(left || '')
    .split(/[^0-9]+/)
    .filter(Boolean)
    .map(Number);
  const rightParts = String(right || '')
    .split(/[^0-9]+/)
    .filter(Boolean)
    .map(Number);
  const length = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < length; index += 1) {
    const difference = (leftParts[index] || 0) - (rightParts[index] || 0);
    if (difference) return difference;
  }

  return 0;
}

export default function VersionHistoryModal({ product, onClose }) {
  const { t } = useLang();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const versions = [...(product.versions || [])].sort((left, right) =>
    compareVersions(right.version, left.version)
  );
  const currentVersion = versions[0]?.version;

  useEffect(() => {
    const previousActiveElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        ) || []
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus?.();
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black px-4 py-8 font-body"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="version-history-title"
        aria-describedby="version-history-product"
        className="w-full max-w-lg"
      >
        <Card accent="purple" interactive={false}>
          <div className="metallic-surface p-7 md:p-9">
            <div className="flex items-start justify-between gap-5 border-b border-zinc-800 pb-5">
              <div>
                <p id="version-history-product" className="mb-2 text-label font-medium uppercase tracking-[0.22em] text-purple-300">
                  {product.name}
                </p>
                <h2 id="version-history-title" className="font-title text-card lowercase text-purple-400">
                  {t('versions.modalTitle')}
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="metallic-control grid h-9 w-9 shrink-0 place-items-center rounded-full border text-white transition-colors duration-200 hover:text-purple-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                aria-label={t('versions.close')}
              >
                <GothicIcon icon={faXmark} size="micro" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {versions.map((release) => {
                const translationKey = `versions.items.${product.key}.${release.key}`;
                const technicalDetails = t(`${translationKey}.technical`);

                return (
                  <article key={release.key} className="border border-zinc-800 bg-[#100c14] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-display text-card-compact text-white">
                        {t('versions.version')} {release.version}
                      </p>
                      {release.version === currentVersion && (
                        <span className="metallic-purple-badge rounded-2xl border px-2.5 py-1 text-label font-semibold uppercase tracking-wider">
                          {t('versions.current')}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-body text-zinc-300">
                      {t(`${translationKey}.description`)}
                    </p>
                    {Array.isArray(technicalDetails) && technicalDetails.length > 0 && (
                      <div className="mt-5 border-t border-zinc-800 pt-4">
                        <p className="mb-3 text-label font-medium uppercase tracking-[0.18em] text-purple-300">
                          {t('versions.technical')}
                        </p>
                        <ul className="space-y-2 text-body-compact text-zinc-300">
                          {technicalDetails.map((detail) => (
                            <li key={detail} className="flex items-start gap-2">
                              <span aria-hidden="true" className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 bg-purple-500" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>,
    document.body
  );
}
