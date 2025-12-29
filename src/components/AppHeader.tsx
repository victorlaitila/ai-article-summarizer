import { useTranslation } from "react-i18next";
import Gradient from "./Gradient";
import LanguageSelector from "./LanguageSelector";
import { Bookmark, FileText } from "lucide-react";

interface AppHeaderProps {
  showSavedSummaries: boolean;
  setShowSavedSummaries: (show: boolean) => void;
}

export default function AppHeader({showSavedSummaries, setShowSavedSummaries}: AppHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="border-b bg-card/80">
      <div className="mx-auto px-4 py-3 [@media(min-width:500px)]:py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gradient />
            <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent flex items-center gap-1.5">
              {t("summary")}
              <span className="inline-block bg-linear-to-r from-primary to-blue-600 text-white rounded-lg px-1 py-px shadow font-bold">
                {t("ai")}
              </span>
            </h1>
          </div>
          <div className="flex gap-3 items-center">

            
            <div className="flex items-center gap-2 bg-card/60 rounded-full p-1">
              {/* Generator icon (selects generator view) */}
              <button
                title="Generator"
                type="button"
                onClick={() => setShowSavedSummaries(false)}
                aria-label={t("generatorView")}
                className={`p-3 cursor-pointer rounded-full transition ${!showSavedSummaries ? "bg-indigo-50 text-indigo-700" : "text-muted-foreground hover:bg-transparent"}`}
              >
                <FileText className="w-4 h-4" />
              </button>

              {/* TODO: update this switch component and functionality */}
              <button
                type="button"
                role="switch"
                aria-checked={showSavedSummaries}
                onClick={() => setShowSavedSummaries(!showSavedSummaries)}
                className={`relative cursor-pointer inline-flex items-center h-8 w-14 rounded-full transition-shadow focus:outline-none ${showSavedSummaries ? "bg-indigo-600" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-6 w-6 transform bg-white rounded-full shadow transition-transform ${showSavedSummaries ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>

              {/* Saved icon (selects saved summaries view) */}
              <button
                title="Saved Summaries"
                type="button"
                onClick={() => setShowSavedSummaries(true)}
                aria-label={t("savedSummaries")}
                className={`p-3 rounded-full cursor-pointer transition ${showSavedSummaries ? "bg-indigo-50 text-indigo-700" : "text-muted-foreground hover:bg-transparent"}`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>


            <span aria-hidden className="h-6 w-px mr-2 bg-muted-foreground/30" />
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  )
}