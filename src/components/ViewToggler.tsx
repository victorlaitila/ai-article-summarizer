import { Bookmark, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ViewTogglerProps {
  showSavedSummaries: boolean;
  setShowSavedSummaries: (show: boolean) => void;
}

export default function ViewToggler({showSavedSummaries, setShowSavedSummaries}: ViewTogglerProps) {
  const { t } = useTranslation();

  return (
    <div className="relative flex items-center bg-gray-100 dark:bg-zinc-900 rounded-full p-1 mr-0.5 w-64 border border-gray-200 dark:border-zinc-800">
      {/* The Sliding Background Highlight */}
      <div
        className={`absolute h-8 w-[calc(50%-4px)] bg-white dark:bg-zinc-800 rounded-full shadow-sm transition-all duration-300 ease-in-out ${
          showSavedSummaries ? "left-[50%]" : "left-1"
        }`}
      />

      {/* Generator View Button */}
      <button
        type="button"
        onClick={() => setShowSavedSummaries(false)}
        className={`relative cursor-pointer z-10 flex flex-1 items-center justify-center gap-1 h-8 rounded-full transition-colors duration-200 ${
          !showSavedSummaries ? "text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <FileText className="w-3.5 h-3.5" />
        <span className="text-xs">{t("generate")}</span>
      </button>

      {/* Saved View Button */}
      <button
        type="button"
        onClick={() => setShowSavedSummaries(true)}
        className={`relative cursor-pointer z-10 flex flex-1 items-center justify-center gap-1 h-8 rounded-full transition-colors duration-200 ${
          showSavedSummaries ? "text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Bookmark className="w-3.5 h-3.5" />
        <span className="text-xs">{t("saved")}</span>
      </button>
    </div>
  )
}