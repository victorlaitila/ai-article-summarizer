import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { useLanguage } from "./contexts/LanguageContext";
import AppHeader from "./components/AppHeader";
import { TOAST_DURATION, USE_MOCK_API } from "./constants";
import MOCK_SAVED_SUMMARIES from "./mockSavedSummaries.json";
import MainGeneratorArea from "./components/MainGeneratorArea";
import MainSavedSummariesArea from "./components/MainSavedSummariesArea";
import type { SavedSummary } from "./types";

export default function App() {
  const [showSavedSummaries, setShowSavedSummaries] = useState<boolean>(false);
  const [savedSummaries, setSavedSummaries] = useState<Array<SavedSummary>>([]);

  const { language, changeLanguage } = useLanguage();

  const fetchSavedSummaries = async () => {
    // Using mock data when no real backend is available
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
  };

  useEffect(() => {
    changeLanguage(language, true); // No toast on initial load
    fetchSavedSummaries();
  }, []);

  return (
    <div className="bg-linear-to-br from-background via-accent/20 to-background">
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            closeButton: "toast-close-button", 
            toast: "toast"
          },
          duration: TOAST_DURATION,
        }}
      />

      <AppHeader showSavedSummaries={showSavedSummaries} setShowSavedSummaries={setShowSavedSummaries} />
      
      {/* Main Content */}
      { showSavedSummaries ? <MainSavedSummariesArea savedSummaries={savedSummaries} /> : <MainGeneratorArea />  }
    </div>
  );
}
