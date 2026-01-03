import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import Summary from "./Summary";
import SummaryButtonGroup from "./SummaryButtonGroup";
import { useSavedSummaries } from "../contexts/SavedSummariesContext";
import NoSavedSummariesPlaceholder from "./NoSavedSummariesPlaceholder";
import { ConfirmDialog } from "./ConfirmDialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { USE_MOCK_API } from "../constants";
import type { SavedSummary } from "../types";

export default function MainSavedSummariesArea() {
  const { t } = useTranslation();
  const { savedSummaries, setSavedSummaries } = useSavedSummaries();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [summaryToDelete, setSummaryToDelete] = useState<number | null>(null);

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

  const handleDeleteSummary = async (id: number) => {
    setSummaryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (summaryToDelete === null) return;

    try {
      if (!USE_MOCK_API) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/summaries/${summaryToDelete}`, {
          method: "DELETE",
        });
        
        if (!res.ok) {
          throw new Error("Failed to delete summary");
        }
      }

      // Remove deleted summary from local state
      setSavedSummaries((prev: SavedSummary[]) => prev.filter(s => s.id !== summaryToDelete));
      
      // Show success toast
      toast.success(t("summaryDeleted"));
    } catch (e) {
      console.error("Error deleting summary", e);
      toast.error(t("deleteFailed"));
    } finally {
      setSummaryToDelete(null);
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

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title={t("confirmDeleteTitle")}
        description={t("confirmDelete")}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        variant="destructive"
      />
    </main>
  );
}
