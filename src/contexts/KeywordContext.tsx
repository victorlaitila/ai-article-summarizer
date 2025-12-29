import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface KeywordContextType {
  generatedKeywords: string[];
  selectedKeywords: string[];
  setGeneratedKeywords: (keywords: string[]) => void;
  toggleKeyword: (keyword: string) => void;
  clearKeywords: () => void;
}

const KeywordContext = createContext<KeywordContextType | undefined>(undefined);

interface KeywordProviderProps {
  children: ReactNode;
}

export const KeywordProvider = ({ children }: KeywordProviderProps) => {
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) => {
      if (prev.includes(keyword)) {
        return prev.filter((k) => k !== keyword);
      }
      return [...prev, keyword];
    });
  };

  const clearKeywords = () => {
    setGeneratedKeywords([]);
    setSelectedKeywords([]);
  };

  const contextValue = {
    generatedKeywords,
    selectedKeywords,
    setGeneratedKeywords,
    toggleKeyword,
    clearKeywords,
  };

  return (
    <KeywordContext.Provider value={contextValue}>
      {children}
    </KeywordContext.Provider>
  );
};

export const useKeywords = () => {
  const context = useContext(KeywordContext);
  if (context === undefined) {
    throw new Error('useKeywords must be used within a KeywordProvider');
  }
  return context;
};