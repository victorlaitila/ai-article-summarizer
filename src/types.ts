export type Language = "en" | "sv" | "fi";
export type SourceType = "url" | "text" | "file"
export type SummaryMode = "default" | "bullets" | "simple";

export type SourceHandler = {
  getInput: () => string;
  clearOtherSources: () => void;
};

export interface ArticleFetchResult {
  article_text: string;
  summary: string;
}

export interface SummarizePayload {
  type: SourceType;
  value: string;
  mode: SummaryMode;
}

export interface SavedSummary {
  id: number;
  summary: string;
  keywords: string[];
  created_at: string;
}