import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faEnvelope,
  faUser,
  faComment,
  faCheck,
  faCopy,
  faCircleCheck,
  faCircleNotch,
  faTag,
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Section, SectionHeading } from './Section';
import NeonButton from './Button';
import Card from './Card';
import { useLang } from '../i18n/LanguageContext';

const inputBase =
  "w-full rounded-2xl border border-zinc-700 bg-zinc-900 py-3.5 pl-12 pr-4 text-body-compact text-white placeholder:text-zinc-600 transition-colors duration-300 focus:border-purple-500 focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Contact() {
  const { t, lang } = useLang();
  const subjects = t('contact.subjects');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(0);
  const [status, setStatus] = useState('idle');
  const [copied, setCopied] = useState(false);
  const formStartedAtRef = useRef(0);
  const selectedSubject = subjects[selectedSubjectIndex];

  useEffect(() => {
    formStartedAtRef.current = Date.now();
  }, []);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('contact@dhreian.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const website = e.currentTarget.elements.website?.value || '';

    setStatus('sending');
    const minimumSending = wait(650);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: selectedSubject,
          message: formData.message,
          lang,
          website,
          startedAt: formStartedAtRef.current,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await minimumSending;
        setStatus('success');
      } else {
        setStatus('idle');
        alert(data.error || t('contact.errorGeneric'));
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setStatus('idle');
      alert(t('contact.errorConnection'));
    }
  };

  return (
    <Section id="contacto" glow={true}>
      <SectionHeading
        eyebrow={t('contact.eyebrow')}
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
      />
      <Card accent="purple" interactive={true}>
        <div className="p-8 md:p-12 lg:p-14">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1.3fr] gap-8 md:gap-12 lg:gap-16 items-stretch">

          <div className="flex flex-col justify-between py-2">
            <div>
              <h3 className="font-body text-label text-purple-700 uppercase tracking-[0.2em] font-medium mb-6">
                {t('contact.channels')}
              </h3>
              <div className="space-y-6">
                <div className="relative group/contact">
                  <a
                    href="mailto:contact@dhreian.com"
                    onClick={handleCopyEmail}
                    className="flex items-center gap-4 text-black transition-colors duration-300 hover:text-purple-500"
                  >
                    <div className="liquid-glass-button grid h-14 w-14 shrink-0 place-items-center rounded-full border border-black bg-black text-white transition-colors duration-300 group-hover/contact:border-purple-500 group-hover/contact:bg-purple-500 group-hover/contact:text-white">
                      <FontAwesomeIcon icon={faEnvelope} fixedWidth className="text-xl" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-body font-medium truncate">contact@dhreian.com</span>
                      <span className="text-meta flex items-center gap-1.5 font-medium uppercase tracking-wider text-black transition-colors duration-300 group-hover/contact:text-purple-500">
                        <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="text-[10px]" />
                        {copied ? t('contact.copied') : t('contact.copy')}
                      </span>
                    </div>
                  </a>
                </div>

                <div className="group/insta">
                  <a
                    href="https://instagram.com/dhreian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-black transition-colors duration-300 hover:text-purple-500"
                  >
                    <div className="liquid-glass-button grid h-14 w-14 shrink-0 place-items-center rounded-full border border-black bg-black text-white transition-colors duration-300 group-hover/insta:border-purple-500 group-hover/insta:bg-purple-500 group-hover/insta:text-white">
                      <FontAwesomeIcon icon={faInstagram} fixedWidth className="text-xl" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-body font-medium">@dhreian</span>
                      <span className="text-meta font-medium uppercase tracking-wider text-black transition-colors duration-300 group-hover/insta:text-purple-500">
                        {t('contact.instaOfficial')}
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="hidden w-px self-stretch bg-black md:block"></div>

          <div className="relative flex flex-col justify-center min-h-[350px]">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center py-8 px-4 h-full animate-contact-success-in">
                <div className="mb-6 grid h-20 w-20 place-items-center rounded-full border border-purple-500 bg-purple-500 animate-contact-success-pop">
                  <FontAwesomeIcon icon={faCircleCheck} fixedWidth className="text-4xl text-white" />
                </div>
                <h3 className="font-display lowercase text-card text-black mb-3">
                  {t('contact.sentTitle')}
                </h3>
                <p className="text-black text-body max-w-sm mb-8">
                  {t('contact.sentBody1')}<span className="text-purple-800 font-semibold">{formData.name}</span>{t('contact.sentBody2')}<span className="text-purple-800 font-semibold lowercase">{selectedSubject}</span>{t('contact.sentBody3')}
                </p>
                <NeonButton
                  as="button"
                  onClick={() => {
                    setFormData({ name: '', email: '', message: '' });
                    setSelectedSubjectIndex(0);
                    setStatus('idle');
                    formStartedAtRef.current = Date.now();
                  }}
                  variant="glass"
                  size="sm"
                  icon={faPaperPlane}
                >
                  {t('contact.sendAnother')}
                </NeonButton>
              </div>
            ) : (
              <form
                className={`space-y-6 transition-all duration-500 ease-out ${
                  status === 'sending' ? 'opacity-80 scale-[0.99]' : 'opacity-100 scale-100'
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label={t('contact.name')} icon={faUser}>
                    <input
                      type="text"
                      placeholder={t('contact.namePlaceholder')}
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputBase}
                      disabled={status === 'sending'}
                    />
                  </InputField>
                  <InputField label={t('contact.email')} icon={faEnvelope}>
                    <input
                      type="email"
                      placeholder={t('contact.emailPlaceholder')}
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputBase}
                      disabled={status === 'sending'}
                    />
                  </InputField>
                </div>

                <div className="space-y-3">
                  <label className="font-body text-label text-purple-700 uppercase tracking-[0.2em] font-medium block">
                    {t('contact.subject')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {subjects.map((s, idx) => {
                      const isSelected = selectedSubjectIndex === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSubjectIndex(idx)}
                          disabled={status === 'sending'}
                          className={`liquid-glass-button px-4 py-3 rounded-2xl border text-label font-semibold uppercase tracking-wider transition-all duration-300 text-left flex items-center gap-2.5 group/chip cursor-pointer ${
                            isSelected
                              ? 'border-purple-500 bg-purple-500 text-white hover:border-black hover:bg-black hover:text-white active:border-black active:bg-black active:text-white'
                              : 'border-black bg-white text-black hover:border-black hover:bg-black hover:text-white active:border-black active:bg-black active:text-white'
                          }`}
                        >
                          <span className="truncate">{s}</span>
                          <FontAwesomeIcon
                            icon={isSelected ? faCheck : faTag}
                            className={`text-xs shrink-0 transition-colors duration-300 ${isSelected ? 'text-white group-hover/chip:text-white' : 'text-black group-hover/chip:text-white'}`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <InputField label={t('contact.message')} icon={faComment} isTextarea>
                  <textarea
                    rows="4"
                    placeholder={t('contact.messagePlaceholder')}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`${inputBase} resize-none pt-3.5`}
                    disabled={status === 'sending'}
                  />
                </InputField>

                <NeonButton
                  as="button"
                  type="submit"
                  variant="primary"
                  surface="light"
                  size="md"
                  className="mt-2 w-full overflow-hidden disabled:cursor-wait disabled:opacity-95"
                  disabled={status === 'sending'}
                >
                  <span className="relative grid min-w-[12.5rem] place-items-center">
                    <span
                      className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-3 transition-all duration-300 ease-out ${
                        status === 'sending'
                          ? '-translate-y-3 opacity-0 blur-[2px]'
                          : 'translate-y-0 opacity-100 blur-0'
                      }`}
                    >
                      <span>{t('contact.send')}</span>
                      <FontAwesomeIcon icon={faPaperPlane} fixedWidth className="w-4 h-4" />
                    </span>
                    <span
                      className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-3 transition-all duration-300 ease-out ${
                        status === 'sending'
                          ? 'translate-y-0 opacity-100 blur-0'
                          : 'translate-y-3 opacity-0 blur-[2px]'
                      }`}
                      aria-hidden={status !== 'sending'}
                    >
                      <span>{t('contact.sending')}</span>
                      <FontAwesomeIcon icon={faCircleNotch} fixedWidth className="w-4 h-4 animate-spin" />
                    </span>
                  </span>
                </NeonButton>
              </form>
            )}
          </div>
          </div>
        </div>
      </Card>
    </Section>
  );
}

function InputField({ label, icon, isTextarea = false, children }) {
  return (
    <div className="space-y-2 group/field relative">
      <label className="font-body text-label text-purple-700 uppercase tracking-[0.2em] font-medium block">
        {label}
      </label>
      <div className="relative">
        <span className={`absolute left-4 text-zinc-500 group-focus-within/field:text-purple-400 transition-colors duration-300 ${
          isTextarea ? 'top-4' : 'top-1/2 -translate-y-1/2'
        }`}>
          <FontAwesomeIcon icon={icon} />
        </span>
        {children}
      </div>
    </div>
  );
}
