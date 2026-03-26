import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardFooter } from "./ui/Card";
import Summary from "./Summary";
import SummaryButtonGroup from "./SummaryButtonGroup";
import { useSavedSummaries } from "../contexts/SavedSummariesContext";
import NoSavedSummariesPlaceholder from "./NoSavedSummariesPlaceholder";
import { ConfirmDialog } from "./ConfirmDialog";
import { Trash2, Calendar, Globe } from "lucide-react";
import { toast } from "sonner";
import { USE_MOCK_API } from "../constants";
import { normalizeKeywords } from "../utils/keywords";
import type { SavedSummary } from "../types";
import SearchAndSort from "./SearchAndSort";

export default function MainSavedSummariesArea() {
  const { t } = useTranslation();
  const { savedSummaries, setSavedSummaries } = useSavedSummaries();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [summaryToDelete, setSummaryToDelete] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

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

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const filteredAndSortedSummaries = useMemo(() => {
    let result = [...savedSummaries];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(summary => {
        const titleMatch = summary.title?.toLowerCase().includes(query);
        
        // Handle keywords using normalizeKeywords utility
        const keywords = normalizeKeywords(summary.keywords);
        const keywordMatch = keywords.some(keyword => 
          keyword.toLowerCase().includes(query)
        );
        
        return titleMatch || keywordMatch;
      });
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [savedSummaries, searchQuery, sortOrder]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Search and Sort Controls */}
        {savedSummaries.length > 0 && (
          <SearchAndSort
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortOrder={sortOrder}
            toggleSortOrder={toggleSortOrder}
          />
        )}

         {/* List of saved summaries */}
        {filteredAndSortedSummaries.length === 0 && savedSummaries.length > 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t("noMatchingResults")}</p>
          </div>
        ) : filteredAndSortedSummaries.length === 0 ? (
          <NoSavedSummariesPlaceholder />
        ) : (
          filteredAndSortedSummaries.map((summary) => (
            <Card key={summary.id} className="shadow-xl border bg-linear-to-br from-card to-accent/10 overflow-hidden gap-2">
              {/* Title Header */}
              <CardHeader className="pb-0">
                {summary.title && (
                  <CardTitle className="text-lg font-semibold text-foreground leading-snug">
                    {summary.title}
                  </CardTitle>
                )}
              </CardHeader>
              
              {/* Summary Content */}
              <Summary summary={summary.content} summaryKeywords={summary.keywords} />
              
              {/* Footer with metadata and actions */}
              <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-border/50">
                {/* Metadata badges */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(summary.created_at)}
                  </span>
                  {summary.url && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Globe className="w-3.5 h-3.5" />
                      {getSourceLabel(summary.url)}
                    </span>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <SummaryButtonGroup summary={{ content: summary.content, url: summary.url }} />
                  <span aria-hidden className="h-5 w-px bg-border mx-1 hidden sm:block" />
                  <button
                    title={t("delete")}
                    onClick={() => handleDeleteSummary(summary.id)}
                    disabled={USE_MOCK_API}
                    className={`p-2 rounded-md transition-colors ${
                      !USE_MOCK_API 
                        ? "hover:bg-red-50 hover:text-red-600 cursor-pointer text-muted-foreground" 
                        : "text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardFooter>
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
