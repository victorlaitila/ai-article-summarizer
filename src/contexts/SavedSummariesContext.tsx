import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { USE_MOCK_API } from "../constants";
import MOCK_SAVED_SUMMARIES from "../mockSavedSummaries.json";
import type { SavedSummary } from "../types";

type ContextType = {
  savedSummaries: SavedSummary[];
  fetchSavedSummaries: () => Promise<void>;
  addSavedSummary: (item: SavedSummary) => void;
  setSavedSummaries: React.Dispatch<React.SetStateAction<SavedSummary[]>>;
};

const SavedSummariesContext = createContext<ContextType | undefined>(undefined);

export const SavedSummariesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedSummaries, setSavedSummaries] = useState<SavedSummary[]>([]);

  const fetchSavedSummaries = useCallback(async () => {
    if (USE_MOCK_API) {
      setSavedSummaries(MOCK_SAVED_SUMMARIES);
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/summaries`);
      if (res.ok) {
        const data = await res.json();
        setSavedSummaries(data.items);
      } else {
        console.error("Failed fetching summaries", res.status);
      }
    } catch (err) {
      console.error("Fetch summaries failed", err);
    }
  }, []);

  const addSavedSummary = useCallback((item: SavedSummary) => {
    setSavedSummaries(prev => [item, ...prev]);
  }, []);

  useEffect(() => {
    fetchSavedSummaries();
  }, [fetchSavedSummaries]);

  return (
    <SavedSummariesContext.Provider value={{ savedSummaries, fetchSavedSummaries, addSavedSummary, setSavedSummaries }}>
      {children}
    </SavedSummariesContext.Provider>
  );
};

export function useSavedSummaries() {
  const ctx = useContext(SavedSummariesContext);
  if (!ctx) {
    throw new Error("useSavedSummaries must be used within SavedSummariesProvider");
  }
  return ctx;
}