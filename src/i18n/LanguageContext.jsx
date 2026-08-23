/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useSyncExternalStore, useEffect, useCallback } from 'react';
import { translations } from './translations';
import { applyPageMetadata } from '../seo/metadata';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'dhreian:lang';

function getStoredLang() {
  if (typeof window === 'undefined') return 'es';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === 'en' || saved === 'es' ? saved : 'es';
}

function subscribeToLanguage(callback) {
  window.addEventListener('storage', callback);
  window.addEventListener('dhreian:languagechange', callback);

  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('dhreian:languagechange', callback);
  };
}

function resolve(dict, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict);
}

export function LanguageProvider({ children, initialLang = 'es' }) {
  const serverLang = initialLang === 'en' ? 'en' : 'es';
  const lang = useSyncExternalStore(subscribeToLanguage, getStoredLang, () => serverLang);

  const setLang = useCallback(
    (nextLang) => {
      const resolvedLang = typeof nextLang === 'function' ? nextLang(lang) : nextLang;
      const normalizedLang = resolvedLang === 'en' ? 'en' : 'es';
      window.localStorage.setItem(STORAGE_KEY, normalizedLang);
      window.dispatchEvent(new Event('dhreian:languagechange'));
    },
    [lang]
  );

  useEffect(() => {
    const syncMetadata = () => applyPageMetadata(window.location.pathname, lang);
    syncMetadata();
    window.addEventListener('popstate', syncMetadata);
    window.addEventListener('dhreian:navigation', syncMetadata);

    return () => {
      window.removeEventListener('popstate', syncMetadata);
      window.removeEventListener('dhreian:navigation', syncMetadata);
    };
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'es' ? 'en' : 'es'));
  }, [setLang]);

  const t = useCallback(
    (key) => {
      const value = resolve(translations[lang], key);
      if (value !== undefined) return value;
      const fallback = resolve(translations.es, key);
      return fallback !== undefined ? fallback : key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang debe usarse dentro de <LanguageProvider>');
  return ctx;
}
