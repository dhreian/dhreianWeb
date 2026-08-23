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
  "w-full bg-zinc-900/60 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30 focus:bg-zinc-900 transition-all duration-300 text-sm md:text-base";

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
    <Section id="contacto" glow={true} glowAccent="fuchsia">
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
              <h3 className="font-body text-xs text-purple-300/80 uppercase tracking-[0.2em] font-semibold mb-6">
                {t('contact.channels')}
              </h3>
              <div className="space-y-6">
                <div className="relative group/contact">
                  <a
                    href="mailto:contact@dhreian.com"
                    onClick={handleCopyEmail}
                    className="flex items-center gap-4 text-zinc-300 hover:text-purple-300 transition-colors duration-300"
                  >
                    <div className="w-14 h-14 rounded-full border border-white/10 text-zinc-400 grid place-items-center transition-all duration-300 group-hover/contact:text-purple-300 group-hover/contact:border-purple-500/50 group-hover/contact:bg-purple-500/10 group-hover/contact:shadow-[0_0_15px_rgba(138,108,255,0.4)] shrink-0">
                      <FontAwesomeIcon icon={faEnvelope} fixedWidth className="text-xl" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-base md:text-lg font-medium truncate">contact@dhreian.com</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1 group-hover/contact:text-purple-400 transition-colors duration-300">
                        <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="text-[8px]" />
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
                    className="flex items-center gap-4 text-zinc-300 hover:text-[#E1306C] transition-colors duration-300"
                  >
                    <div className="w-14 h-14 rounded-full border border-white/10 text-zinc-400 grid place-items-center transition-all duration-300 group-hover/insta:text-[#E1306C] group-hover/insta:border-[#E1306C]/50 group-hover/insta:bg-[#E1306C]/10 group-hover/insta:shadow-[0_0_15px_rgba(225,48,108,0.4)] shrink-0">
                      <FontAwesomeIcon icon={faInstagram} fixedWidth className="text-xl" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base md:text-lg font-medium">@dhreian</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest group-hover/insta:text-[#E1306C] transition-colors duration-300">
                        {t('contact.instaOfficial')}
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                {t('contact.available')}
              </span>
            </div>
          </div>

          <div className="w-px bg-gradient-to-b from-transparent via-purple-500/15 to-transparent hidden md:block self-stretch"></div>

          <div className="relative flex flex-col justify-center min-h-[350px]">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center py-8 px-4 h-full animate-contact-success-in">
                <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 grid place-items-center mb-6 shadow-[0_0_30px_rgba(138,108,255,0.25)] animate-contact-success-pop">
                  <FontAwesomeIcon icon={faCircleCheck} fixedWidth className="text-purple-400 text-4xl" />
                </div>
                <h3 className="font-display lowercase text-3xl text-white mb-3">
                  {t('contact.sentTitle')}
                </h3>
                <p className="text-zinc-400 text-sm max-w-sm mb-8 leading-relaxed">
                  {t('contact.sentBody1')}<span className="text-purple-300 font-semibold">{formData.name}</span>{t('contact.sentBody2')}<span className="text-purple-300 font-semibold lowercase">{selectedSubject}</span>{t('contact.sentBody3')}
                </p>
                <NeonButton
                  as="button"
                  onClick={() => {
                    setFormData({ name: '', email: '', message: '' });
                    setSelectedSubjectIndex(0);
                    setStatus('idle');
                    formStartedAtRef.current = Date.now();
                  }}
                  variant="outline"
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
                  <label className="font-body text-xs text-purple-300/80 uppercase tracking-[0.2em] font-semibold block">
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
                          className={`px-4 py-3 rounded-2xl border text-xs font-semibold uppercase tracking-wider transition-all duration-300 text-left flex items-center gap-2.5 group/chip cursor-pointer ${
                            isSelected
                              ? 'bg-purple-950/20 border-purple-500/80 text-purple-300 shadow-[0_0_15px_rgba(138,108,255,0.15)]'
                              : 'bg-zinc-900/40 border-white/5 text-zinc-500 hover:border-white/15 hover:text-zinc-300'
                          }`}
                        >
                          <span className="truncate">{s}</span>
                          <FontAwesomeIcon
                            icon={isSelected ? faCheck : faTag}
                            className={`text-xs shrink-0 ${isSelected ? 'text-purple-400' : 'text-zinc-600 group-hover/chip:text-zinc-400'}`}
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
                  size="md"
                  className="w-full mt-2 min-h-[58px] overflow-hidden disabled:cursor-wait disabled:opacity-95"
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
      <label className="font-body text-xs text-purple-300/80 uppercase tracking-[0.2em] font-semibold block">
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
