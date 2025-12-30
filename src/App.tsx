import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { useLanguage } from "./contexts/LanguageContext";
import AppHeader from "./components/AppHeader";
import { TOAST_DURATION } from "./constants";
import MainGeneratorArea from "./components/MainGeneratorArea";
import MainSavedSummariesArea from "./components/MainSavedSummariesArea";

export default function App() {
  const [showSavedSummaries, setShowSavedSummaries] = useState<boolean>(false);

  const { language, changeLanguage } = useLanguage();

  useEffect(() => {
    changeLanguage(language, true); // No toast on initial load
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
      <div className="relative">
        <div aria-hidden={showSavedSummaries} className={showSavedSummaries ? "hidden" : ""}>
          <MainGeneratorArea />
        </div>

        <div aria-hidden={!showSavedSummaries} className={!showSavedSummaries ? "hidden" : ""}>
          <MainSavedSummariesArea />
        </div>
      </div>
    </div>
  );
}
