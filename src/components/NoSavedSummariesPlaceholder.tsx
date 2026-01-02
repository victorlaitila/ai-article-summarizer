import { useTranslation } from "react-i18next";

export default function NoSavedSummariesPlaceholder() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[68vh] text-center">
      <img src="no-saved-summaries-placeholder.png" width={600} />
      <h2 className="text-2xl font-bold mb-3 mt-3">
        {t("noSavedSummaries")}
      </h2>
      <p className="text-muted-foreground max-w-md mb-8 text-lg">
        {t("noSavedSummariesDescription")}
      </p>
    </div>
  )
}