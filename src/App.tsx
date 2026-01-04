import { useState } from "react";
import { Toaster } from "sonner";
import AppHeader from "./components/AppHeader";
import { TOAST_DURATION } from "./constants";
import MainGeneratorArea from "./components/MainGeneratorArea";
import MainSavedSummariesArea from "./components/MainSavedSummariesArea";
import { useSavedSummaries } from "./contexts/SavedSummariesContext";

export default function App() {
  const [showSavedSummaries, setShowSavedSummaries] = useState<boolean>(false);

  const { savedSummaries } = useSavedSummaries();

  return (
    <div className={showSavedSummaries && savedSummaries.length === 0 ? "bg-white h-screen" : "bg-linear-to-br from-background via-accent/20 to-background h-screen"}>
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
