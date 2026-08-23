import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleNotch,
  faDownload,
  faEnvelope,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Card from './Card';
import NeonButton from './Button';
import { useLang } from '../i18n/LanguageContext';

const inputBase =
  'w-full rounded-2xl border border-white/5 bg-zinc-900/60 py-3.5 pl-12 pr-4 text-sm md:text-base text-white placeholder:text-zinc-600 transition-all duration-300 focus:border-fuchsia-400/50 focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 disabled:cursor-wait disabled:opacity-70';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function PluginDownloadModal({ plugin, onClose }) {
  const { t, lang } = useLang();
  const dialogRef = useRef(null);
  const nameInputRef = useRef(null);
  const successHeadingRef = useRef(null);
  const isSendingRef = useRef(false);
  const formStartedAtRef = useRef(0);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const isSending = status === 'sending';

  useEffect(() => {
    formStartedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    isSendingRef.current = isSending;
  }, [isSending]);

  useEffect(() => {
    const previousActiveElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    nameInputRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isSendingRef.current) {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), a[href], [tabindex]:not([tabindex="-1"])'
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

  useEffect(() => {
    if (status === 'success') successHeadingRef.current?.focus();
  }, [status]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const website = event.currentTarget.elements.website?.value || '';
    setStatus('sending');
    setErrorMessage('');
    const minimumSending = wait(650);

    try {
      const response = await fetch('/api/plugin-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          pluginKey: plugin.key,
          lang,
          website,
          startedAt: formStartedAtRef.current,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        await minimumSending;
        setStatus('success');
        return;
      }

      setStatus('idle');
      setErrorMessage(data.error || t('plugins.downloadModal.errorGeneric'));
    } catch (error) {
      console.error('Error al solicitar el enlace del plugin:', error);
      setStatus('idle');
      setErrorMessage(t('plugins.downloadModal.errorConnection'));
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/85 px-4 py-8 font-body"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSending) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="plugin-download-title"
        className="w-full max-w-lg animate-contact-success-in"
      >
        <Card accent="fuchsia" interactive={false}>
          <div className="bg-zinc-950/95 p-8 md:p-12">
            {status === 'success' ? (
              <div className="flex flex-col items-center py-3 text-center" aria-live="polite">
                <div className="mb-6 grid h-20 w-20 place-items-center rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 shadow-[0_0_30px_rgba(56,129,181,0.25)] animate-contact-success-pop">
                  <FontAwesomeIcon icon={faCircleCheck} fixedWidth className="text-4xl text-fuchsia-300" />
                </div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-fuchsia-300/80">
                  {plugin.name}
                </p>
                <h3
                  ref={successHeadingRef}
                  id="plugin-download-title"
                  tabIndex="-1"
                  className="mb-3 font-display text-3xl lowercase text-white outline-none"
                >
                  {t('plugins.downloadModal.successTitle')}
                </h3>
                <p className="mb-8 max-w-sm text-sm leading-relaxed text-zinc-400">
                  {t('plugins.downloadModal.successBody1')}
                  <span className="font-semibold text-fuchsia-200">{formData.email}</span>
                  {t('plugins.downloadModal.successBody2')}
                </p>
                <NeonButton as="button" type="button" variant="outlineFuchsia" size="sm" onClick={onClose}>
                  {t('plugins.downloadModal.close')}
                </NeonButton>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <h3 id="plugin-download-title" className="font-display text-3xl lowercase text-white neon-text-fuchsia sm:text-4xl">
                    {t('plugins.downloadModal.title')}
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
                    {t('plugins.downloadModal.description1')}
                    <span className="font-semibold text-fuchsia-200">{plugin.name}</span>
                    {t('plugins.downloadModal.description2')}
                  </p>
                </div>

                <form
                  className={`space-y-6 transition-all duration-500 ease-out ${
                    isSending ? 'opacity-80 scale-[0.99]' : 'opacity-100 scale-100'
                  }`}
                  onSubmit={handleSubmit}
                >
                  <input
                    type="text"
                    name="website"
                    autoComplete="off"
                    tabIndex="-1"
                    aria-hidden="true"
                    hidden
                  />
                  <ModalInput label={t('plugins.downloadModal.name')} icon={faUser}>
                    <input
                      ref={nameInputRef}
                      type="text"
                      name="name"
                      autoComplete="name"
                      maxLength="160"
                      required
                      value={formData.name}
                      placeholder={t('plugins.downloadModal.namePlaceholder')}
                      className={inputBase}
                      disabled={isSending}
                      onChange={(event) =>
                        setFormData((current) => ({ ...current, name: event.target.value }))
                      }
                    />
                  </ModalInput>

                  <ModalInput label={t('plugins.downloadModal.email')} icon={faEnvelope}>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      maxLength="320"
                      required
                      value={formData.email}
                      placeholder={t('plugins.downloadModal.emailPlaceholder')}
                      className={inputBase}
                      disabled={isSending}
                      onChange={(event) =>
                        setFormData((current) => ({ ...current, email: event.target.value }))
                      }
                    />
                  </ModalInput>

                  {errorMessage && (
                    <p
                      className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-200"
                      role="alert"
                    >
                      {errorMessage}
                    </p>
                  )}

                  <p className="text-center text-[11px] leading-relaxed text-zinc-600">
                    {t('plugins.downloadModal.privacy')}
                  </p>

                  <div className="pt-2">
                    <NeonButton
                      as="button"
                      type="submit"
                      variant="fuchsia"
                      size="md"
                      className="w-full min-h-[58px] overflow-hidden disabled:cursor-wait disabled:opacity-95"
                      disabled={isSending}
                    >
                      <span className="relative grid place-items-center">
                        <span
                          className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-3 transition-all duration-300 ease-out ${
                            isSending
                              ? '-translate-y-3 opacity-0 blur-[2px]'
                              : 'translate-y-0 opacity-100 blur-0'
                          }`}
                        >
                          <span>{t('plugins.downloadModal.submit')}</span>
                          <FontAwesomeIcon icon={faDownload} fixedWidth className="w-4 h-4" />
                        </span>
                        <span
                          className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-3 transition-all duration-300 ease-out ${
                            isSending
                              ? 'translate-y-0 opacity-100 blur-0'
                              : 'translate-y-3 opacity-0 blur-[2px]'
                          }`}
                          aria-hidden={!isSending}
                        >
                          <span>{t('plugins.downloadModal.sending')}</span>
                          <FontAwesomeIcon icon={faCircleNotch} fixedWidth className="w-4 h-4 animate-spin" />
                        </span>
                      </span>
                    </NeonButton>
                  </div>
                </form>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>,
    document.body
  );
}

function ModalInput({ label, icon, children }) {
  return (
    <label className="group block space-y-2">
      <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-300/80">
        {label}
      </span>
      <span className="relative block">
        <FontAwesomeIcon
          icon={icon}
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-zinc-500 transition-colors duration-300 group-focus-within:text-fuchsia-400"
        />
        {children}
      </span>
    </label>
  );
}
