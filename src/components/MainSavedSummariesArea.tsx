import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import Summary from "./Summary";
import SummaryButtonGroup from "./SummaryButtonGroup";
import { useSavedSummaries } from "../contexts/SavedSummariesContext";

export default function MainSavedSummariesArea() {
  const { t } = useTranslation();
  const { savedSummaries } = useSavedSummaries();

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">

         {/* List of saved summaries */}
        {savedSummaries.length === 0 ? (
          <Card className="shadow-xl bg-linear-to-br from-card to-purple-50/30">
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              {t("noSavedSummaries")}
            </CardContent>
          </Card>
        ) : (
          savedSummaries.map((item) => (
            <Card key={item.id} className="shadow-xl bg-linear-to-br from-card to-purple-50/30">
              <CardHeader>
                <div className="flex justify-between max-[520px]:flex-col max-[520px]:gap-2.5">
                  <CardTitle className="text-2xl font-medium">{t("generatedSummary")}</CardTitle>
                  <SummaryButtonGroup summary={item.summary} />
                </div>
              </CardHeader>
              <Summary summary={item.summary} summaryKeywords={item.keywords} />
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
