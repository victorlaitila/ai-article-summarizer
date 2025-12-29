import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '../types';
import i18n from '../i18n';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language, noToast?: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en'); 

  const { t } = useTranslation();

  const changeLanguage = (lang: Language, noToast?: boolean) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    if (!noToast) {
      toast.success(t("langChanged"));
    }
  };

  const contextValue = {
    language,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};