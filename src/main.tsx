import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { KeywordProvider } from './contexts/KeywordContext.tsx';
import { SavedSummariesProvider } from './contexts/SavedSummariesContext.tsx';
import './index.css'
import "./i18n";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SavedSummariesProvider>
      <LanguageProvider>
        <KeywordProvider>
          <App />
        </KeywordProvider>
      </LanguageProvider>
    </SavedSummariesProvider>
  </StrictMode>,
)
