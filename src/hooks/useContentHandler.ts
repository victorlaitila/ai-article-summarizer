import { useState } from "react";
import { toast } from "sonner";
import { extractKeywords } from "../utils/keywords";
import type { ArticleFetchResult, SourceType, SummaryMode } from "../types";
import { useKeywords } from "../contexts/KeywordContext";
import { fetchArticle, fetchFileSummary, fetchMockArticle } from "../api/summarize";
import { useTranslation } from "react-i18next";
import { USE_MOCK_API } from "../constants";

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function useContentHandler(summaryMode: SummaryMode) {
  const [lastInputHash, setLastInputHash] = useState<string>("");
  const { clearKeywords, setGeneratedKeywords } = useKeywords();

  const { t } = useTranslation();

  // Generate a unique hash combining source type, content, and summary mode
  const generateInputHash = (type: SourceType, value: string, mode: string) => {
    return `${type}:${mode}:${value.trim().slice(0, 100)}`;
  }

  // Unified generation handler for all input types
  const handleGenerate = async (type: SourceType, value: string, file?: File) => {
    const currentHash = generateInputHash(type, value, summaryMode);

    // Prevent duplicate submission of same content + same mode
    if (currentHash === lastInputHash) {
      toast.error(t("noDuplicateSubmission"));
      return null;
    }

    // Validating URL
    if (type === "url" && !isValidUrl(value)) {
      toast.error(t("enterValidUrl"));
      return null;
    }

    try {
      let result: ArticleFetchResult;
      if (USE_MOCK_API) {
        result = await fetchMockArticle(summaryMode);
      } else if (type === "file" && file) {
        result = await fetchFileSummary(file, summaryMode);
      } else {
        result = await fetchArticle({ type, value, mode: summaryMode });
      }

      clearKeywords();
      const keywords = extractKeywords(result.article_text, 5);
      setGeneratedKeywords(keywords);
      setLastInputHash(currentHash);
      return result;
    } catch (err) {
      toast.error(t("failedToFetchData"));
      setLastInputHash(currentHash);
      return null;
    }
  };

  return { handleGenerate };
}
