import MOCK_ARTICLES from "../mockArticles.json";
import type { SummarizePayload, SummaryMode, ArticleFetchResult } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail);
  }
  return data;
};
  
// Fetch from live API
export const fetchArticle = async (payload: SummarizePayload): Promise<ArticleFetchResult> => {
  const response = await fetch(`${API_URL}/summarize/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await handleApiResponse<ArticleFetchResult>(response);
  return data;
};

// Handle file upload to backend
export const fetchFileSummary = async (file: File, summaryMode: SummaryMode): Promise<ArticleFetchResult> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("mode", summaryMode);

  const response = await fetch(`${API_URL}/summarize/file`, {
    method: "POST",
    body: formData,
  });

  const data = await handleApiResponse<ArticleFetchResult>(response);
  return data;
};

// Mock fetching
export const fetchMockArticle = (summaryMode: SummaryMode): Promise<ArticleFetchResult> => {
  return new Promise((resolve) => {
    const mockDelay = Math.random() * 2000 + 1000; // 2-3 seconds
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * MOCK_ARTICLES.length);
      const mockArticle = MOCK_ARTICLES[randomIndex];
      const mockSummary = mockArticle.summaries?.[summaryMode];
      resolve({
        article_text: mockArticle.article_text,
        summary: mockSummary,
      });
    }, mockDelay);
  });
};