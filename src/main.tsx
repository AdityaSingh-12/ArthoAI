import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './i18n/LanguageContext'
import { AppStateProvider } from './state/AppState'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </LanguageProvider>
  </StrictMode>,
)