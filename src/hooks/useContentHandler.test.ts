import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContentHandler } from './useContentHandler';
import * as summarizeApi from '../api/summarize';
import * as keywordsUtil from '../utils/keywords';
import { toast } from 'sonner';
import type { SummaryMode } from '../types';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../contexts/KeywordContext', () => ({
  useKeywords: () => ({
    clearKeywords: vi.fn(),
    setGeneratedKeywords: vi.fn(),
  }),
}));

vi.mock('../api/summarize');
vi.mock('../utils/keywords');

describe('useContentHandler', () => {
  const mockFetchArticle = vi.mocked(summarizeApi.fetchArticle);
  const mockFetchFileSummary = vi.mocked(summarizeApi.fetchFileSummary);
  const mockExtractKeywords = vi.mocked(keywordsUtil.extractKeywords);

  const mockArticleResult = {
    article_text: 'Sample article text for testing',
    summary: 'Sample summary',
    title: 'Sample Title',
    url: 'https://example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockExtractKeywords.mockReturnValue(['keyword1', 'keyword2', 'keyword3']);
  });

  it('should handle text input generation successfully', async () => {
    mockFetchArticle.mockResolvedValue(mockArticleResult);

    const { result } = renderHook(() => useContentHandler('simple'));

    let response;
    await act(async () => {
      response = await result.current.handleGenerate('text', 'Sample text content');
    });

    expect(mockFetchArticle).toHaveBeenCalledWith({
      type: 'text',
      value: 'Sample text content',
      mode: 'simple',
    });
    expect(response).toEqual(mockArticleResult);
    expect(mockExtractKeywords).toHaveBeenCalledWith('Sample article text for testing', 5);
  });

  it('should handle URL input generation successfully', async () => {
    mockFetchArticle.mockResolvedValue(mockArticleResult);

    const { result } = renderHook(() => useContentHandler('default'));

    await act(async () => {
      await result.current.handleGenerate('url', 'https://example.com/article');
    });

    expect(mockFetchArticle).toHaveBeenCalledWith({
      type: 'url',
      value: 'https://example.com/article',
      mode: 'default',
    });
  });

  it('should validate URL and show error for invalid URL', async () => {
    const { result } = renderHook(() => useContentHandler('bullets'));

    let response;
    await act(async () => {
      response = await result.current.handleGenerate('url', 'not-a-valid-url');
    });

    expect(toast.error).toHaveBeenCalledWith('enterValidUrl');
    expect(response).toBeNull();
    expect(mockFetchArticle).not.toHaveBeenCalled();
  });

  it('should handle file upload generation successfully', async () => {
    mockFetchFileSummary.mockResolvedValue(mockArticleResult);

    const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const { result } = renderHook(() => useContentHandler('default'));

    await act(async () => {
      await result.current.handleGenerate('file', 'test.txt', mockFile);
    });

    expect(mockFetchFileSummary).toHaveBeenCalledWith(mockFile, 'default');
  });

  it('should prevent duplicate submissions with same content and mode', async () => {
    mockFetchArticle.mockResolvedValue(mockArticleResult);

    const { result } = renderHook(() => useContentHandler('default'));

    // First submission
    await act(async () => {
      await result.current.handleGenerate('text', 'Same content');
    });

    expect(mockFetchArticle).toHaveBeenCalledTimes(1);

    // Second submission with same content and mode
    await act(async () => {
      await result.current.handleGenerate('text', 'Same content');
    });

    expect(toast.error).toHaveBeenCalledWith('noDuplicateSubmission');
    expect(mockFetchArticle).toHaveBeenCalledTimes(1); // Should not be called again
  });

  it('should allow submission when changing summary mode', async () => {
    mockFetchArticle.mockResolvedValue(mockArticleResult);

    const { result, rerender } = renderHook(
      ({ mode }) => useContentHandler(mode),
      { initialProps: { mode: 'default' as SummaryMode } }
    );

    // First submission with 'default' mode
    await act(async () => {
      await result.current.handleGenerate('text', 'Same content');
    });

    expect(mockFetchArticle).toHaveBeenCalledTimes(1);

    // Change mode and rerender
    rerender({ mode: 'bullets' });

    // Second submission with 'bullets' mode (should be allowed)
    await act(async () => {
      await result.current.handleGenerate('text', 'Same content');
    });

    expect(mockFetchArticle).toHaveBeenCalledTimes(2);
    expect(toast.error).not.toHaveBeenCalledWith('noDuplicateSubmission');
  });

  it('should handle API errors gracefully', async () => {
    mockFetchArticle.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useContentHandler('default'));

    let response;
    await act(async () => {
      response = await result.current.handleGenerate('text', 'Test content');
    });

    expect(toast.error).toHaveBeenCalledWith('failedToFetchData');
    expect(response).toBeNull();
  });

  it('should extract keywords from article text', async () => {
    mockFetchArticle.mockResolvedValue(mockArticleResult);
    mockExtractKeywords.mockReturnValue(['tech', 'innovation', 'future']);

    const { result } = renderHook(() => useContentHandler('default'));

    await act(async () => {
      await result.current.handleGenerate('text', 'Tech article');
    });

    expect(mockExtractKeywords).toHaveBeenCalledWith('Sample article text for testing', 5);
  });
});
