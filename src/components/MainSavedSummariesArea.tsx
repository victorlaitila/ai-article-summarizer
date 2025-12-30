import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import Summary from "./Summary";
import SummaryButtonGroup from "./SummaryButtonGroup";
import { useSavedSummaries } from "../contexts/SavedSummariesContext";
import NoSavedSummariesPlaceholder from "./NoSavedSummariesPlaceholder";

export default function MainSavedSummariesArea() {
  const { t } = useTranslation();
  const { savedSummaries } = useSavedSummaries();

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">

         {/* List of saved summaries */}
        {savedSummaries.length === 0 ? (
          <NoSavedSummariesPlaceholder />
        ) : (
          savedSummaries.map((summary) => (
            <Card key={summary.id} className="shadow-xl bg-linear-to-br from-card to-purple-50/30">
              <CardHeader>
                <div className="flex justify-between max-[520px]:flex-col max-[520px]:gap-2.5">
                  <CardTitle className="text-2xl font-medium">{t("generatedSummary")}</CardTitle>
                  <SummaryButtonGroup summary={{content: summary.content, url: summary.url}} />
                </div>
              </CardHeader>
              <Summary summary={summary.content} summaryKeywords={summary.keywords} />
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
