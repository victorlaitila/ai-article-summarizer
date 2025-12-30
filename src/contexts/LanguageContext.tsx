import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '../types';
import i18n from '../i18n';
import { toast } from 'sonner';

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

  const changeLanguage = async (lang: Language, noToast?: boolean) => {
    await i18n.changeLanguage(lang);
    setLanguage(lang);
    if (!noToast) {
      toast.success(i18n.t("langChanged"));
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