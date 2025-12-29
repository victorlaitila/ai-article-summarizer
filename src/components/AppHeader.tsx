import { useTranslation } from "react-i18next";
import Gradient from "./Gradient";
import LanguageSelector from "./LanguageSelector";
import { Button } from "./ui/Button";
import { Bookmark } from "lucide-react";

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
              <span className="inline-block bg-linear-to-r from-primary to-blue-600 text-white rounded-lg px-1 py-0.25 shadow font-bold">
                {t("ai")}
              </span>
            </h1>
          </div>
          <div className="flex gap-3 items-center">
            <Button
              variant="outline" 
              size="sm" 
              onClick={() => setShowSavedSummaries(!showSavedSummaries)}
              className={showSavedSummaries ? "h-9 bg-indigo-50 border-indigo-200 text-indigo-700" : "h-9 hover:bg-indigo-50 hover:indigo-amber-200 hover:text-indigo-700"}
            >
              <Bookmark className="w-4 h-4" />
              Saved Summaries
            </Button>
            <span aria-hidden className="h-6 w-px bg-muted-foreground/30" />
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  )
}