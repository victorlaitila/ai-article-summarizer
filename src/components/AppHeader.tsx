import { useTranslation } from "react-i18next";
import Gradient from "./Gradient";
import LanguageSelector from "./LanguageSelector";
import ViewToggler from "./ViewToggler";

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
          <div className="flex items-center gap-2 [@media(min-width:500px)]:gap-3">
            <Gradient />
            <h1 className="text-xl [@media(min-width:500px)]:text-3xl font-bold bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent flex items-center gap-1 [@media(min-width:500px)]:gap-1.5">
              {t("summary")}
              <span className="inline-block bg-linear-to-r from-primary to-blue-600 text-white rounded-lg px-1 py-px shadow font-bold">
                {t("ai")}
              </span>
            </h1>
          </div>
          <div className="flex gap-3 items-center">
            <ViewToggler showSavedSummaries={showSavedSummaries} setShowSavedSummaries={setShowSavedSummaries} />
            <span aria-hidden className="h-6 w-px mr-1.5 [@media(min-width:500px)]:mr-2 [@media(min-width:500px)]:ml-1 bg-muted-foreground/30" />
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  )
}