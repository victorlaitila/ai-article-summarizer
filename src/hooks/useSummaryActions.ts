import { useCallback } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useKeywords } from "../contexts/KeywordContext";
import { ARTICLE_SUMMARY_FILENAME, ARTICLE_SUMMARY_SHARE_TITLE } from "../constants";
import type { SavedSummary } from "../types";
import { useSavedSummaries } from "../contexts/SavedSummariesContext";

export function useSummaryActions(summary: string) {
  const { t } = useTranslation();
  const { generatedKeywords } = useKeywords();
  const { addSavedSummary } = useSavedSummaries();

  const handleCopy = useCallback(async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard not supported");
      }
      await navigator.clipboard.writeText(summary);
      toast.success(t("copiedMessage"));
    } catch (err) {
      console.error("Copy failed", err);
    }
  }, [summary, t]);

  const handleDownload = useCallback(() => {
    try {
      const blob = new Blob([summary], { type: "text/plain" });
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = ARTICLE_SUMMARY_FILENAME;
      // Append to body so it works in Firefox
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Revoke after a short delay to ensure the download started
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      toast.success(t("downloadedMessage"));
    } catch (err) {
      console.error("Download failed", err);
    }
  }, [summary, t]);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: ARTICLE_SUMMARY_SHARE_TITLE,
          text: summary,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await handleCopy();
      }
    } catch (err) {
      if ((err as any)?.name === "AbortError") {
        return;
      }
      console.error("Share failed", err);
    }
  }, [summary, t, handleCopy]);

  const handleSave = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/summaries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary,
          keywords: generatedKeywords,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Save failed", res.status, err);
        toast.error(t("summarySavedFailureMessage"));
        return;
      }

      const created: SavedSummary | null = await res.json();
      // For updating UI with the newly created summary
      if (created) {
        // TODO: check the updated list of saved summaries
        console.log("Saved summary", created);
        addSavedSummary(created);
      }

      toast.success(t("summarySavedSuccessMessage"));
    } catch (e) {
      console.error("Error saving summary", e);
      toast.error(t("summarySavedFailureMessage"));
    }
  }, [summary, t, generatedKeywords]);

  return { handleCopy, handleDownload, handleShare, handleSave };
}
