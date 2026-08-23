import React, { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';

export function render() {
  return renderToString(
    <StrictMode>
      <LanguageProvider initialLang="es">
        <App />
      </LanguageProvider>
    </StrictMode>
  );
}
