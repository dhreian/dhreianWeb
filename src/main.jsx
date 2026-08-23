import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'

const container = document.getElementById('root')
const application = (
  <StrictMode>
    <LanguageProvider initialLang="es">
      <App />
    </LanguageProvider>
  </StrictMode>
)

if (container.hasChildNodes()) {
  hydrateRoot(container, application)
} else {
  createRoot(container).render(application)
}
