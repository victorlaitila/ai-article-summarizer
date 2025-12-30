import { Bookmark } from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { useTranslation } from "react-i18next";

export default function NoSavedSummariesPlaceholder() {
  const { t } = useTranslation();

  return (
    <Card className="shadow-xl border bg-linear-to-br from-card to-accent/10">
      <CardContent className="mb-8 flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary to-blue-600 flex items-center justify-center mb-6 shadow-lg">
          <Bookmark className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-lg font-medium mb-2">{t("noSavedSummaries")}</h3>
        <div className="text-muted-foreground max-w-sm">
          {t("noSavedSummariesDescription")}
        </div>
      </CardContent>
    </Card>
  )
}