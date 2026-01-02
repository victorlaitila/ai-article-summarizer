import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import Summary from "./Summary";
import SummaryButtonGroup from "./SummaryButtonGroup";
import { useSavedSummaries } from "../contexts/SavedSummariesContext";
import NoSavedSummariesPlaceholder from "./NoSavedSummariesPlaceholder";
import { Trash2 } from "lucide-react";

export default function MainSavedSummariesArea() {
  const { t } = useTranslation();
  const { savedSummaries } = useSavedSummaries();

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(String(iso));
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  const getSourceLabel = (url?: string) => {
    if (!url) return null;
    try {
      const host = new URL(url).hostname.replace(/^www\./i, "");
      const label = host.split(".")[0] || host;
      return label.charAt(0).toUpperCase() + label.slice(1);
    } catch {
      return null;
    }
  };

  // TODO: implement delete functionality
  const handleDeleteSummary = async (id: number) => {
    try {
      
    } catch (e) {
      console.error("Error deleting summary", e);
    
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-4">
         {/* List of saved summaries */}
        {savedSummaries.length === 0 ? (
          <NoSavedSummariesPlaceholder />
        ) : (
          savedSummaries.map((summary) => (
            <Card key={summary.id} className="shadow-xl border bg-linear-to-br from-card to-accent/10">
              <CardHeader>
                <div className="flex justify-between max-[520px]:flex-col max-[520px]:gap-2.5 items-start">
                  <div className="flex items-center gap-3">
                    {/* Delete summary button */}
                    <button
                      title={t("delete")}
                      onClick={() => handleDeleteSummary(summary.id)}
                      className="hover:text-red-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span aria-hidden className="h-4 w-px ml-1 bg-muted-foreground/30" />
                    <CardTitle className="text-lg font-medium">{formatDate(summary.created_at)}</CardTitle>
                    {summary.url && (
                      <div className="flex items-center gap-3.5">
                        <span aria-hidden className="h-4 w-px ml-1 bg-muted-foreground/30" />
                        <span className="px-0.5">{getSourceLabel(summary.url)}</span>
                      </div>
                    )}
                  </div>
                  <SummaryButtonGroup summary={{ content: summary.content, url: summary.url }} />
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
