import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSummaryActions } from './useSummaryActions';
import { toast } from 'sonner';
import type { TempSummary } from '../types';

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
    generatedKeywords: ['tech', 'innovation'],
  }),
}));

vi.mock('../contexts/SavedSummariesContext', () => ({
  useSavedSummaries: () => ({
    addSavedSummary: vi.fn(),
  }),
}));

describe('useSummaryActions', () => {
  const mockSummary: TempSummary = {
    content: 'This is a test summary content',
    title: 'Test Title',
    url: 'https://example.com/article',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleOpenLink', () => {
    it('should open URL in new tab when URL exists', () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      const { result } = renderHook(() => useSummaryActions(mockSummary));

      act(() => {
        result.current.handleOpenLink();
      });

      expect(windowOpenSpy).toHaveBeenCalledWith('https://example.com/article', '_blank');
      windowOpenSpy.mockRestore();
    });

    it('should not open link when URL is undefined', () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      const summaryWithoutUrl = { ...mockSummary, url: undefined };

      const { result } = renderHook(() => useSummaryActions(summaryWithoutUrl));

      act(() => {
        result.current.handleOpenLink();
      });

      expect(windowOpenSpy).not.toHaveBeenCalled();
      windowOpenSpy.mockRestore();
    });
  });

  describe('handleCopy', () => {
    it('should copy content to clipboard successfully', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      const { result } = renderHook(() => useSummaryActions(mockSummary));

      await act(async () => {
        await result.current.handleCopy();
      });

      expect(writeTextMock).toHaveBeenCalledWith('This is a test summary content');
      expect(toast.success).toHaveBeenCalledWith('copiedMessage');
    });

    it('should handle clipboard errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      Object.assign(navigator, {
        clipboard: undefined,
      });

      const { result } = renderHook(() => useSummaryActions(mockSummary));

      await act(async () => {
        await result.current.handleCopy();
      });

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('handleDownload', () => {
    it('should call handleDownload without errors', () => {
      const { result } = renderHook(() => useSummaryActions(mockSummary));

      // Verify the function exists and can be called
      expect(() => {
        act(() => {
          result.current.handleDownload();
        });
      }).not.toThrow();
    });
  });

  describe('handleShare', () => {
    it('should use Web Share API when available', async () => {
      const shareMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        share: shareMock,
      });

      const { result } = renderHook(() => useSummaryActions(mockSummary));

      await act(async () => {
        await result.current.handleShare();
      });

      expect(shareMock).toHaveBeenCalledWith({
        title: expect.any(String),
        text: 'This is a test summary content',
      });
    });

    it('should fall back to copy when Web Share API is not available', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        share: undefined,
        clipboard: {
          writeText: writeTextMock,
        },
      });

      const { result } = renderHook(() => useSummaryActions(mockSummary));

      await act(async () => {
        await result.current.handleShare();
      });

      expect(writeTextMock).toHaveBeenCalledWith('This is a test summary content');
    });

    it('should handle AbortError silently', async () => {
      const abortError = new Error('User cancelled');
      (abortError as any).name = 'AbortError';
      
      const shareMock = vi.fn().mockRejectedValue(abortError);
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      Object.assign(navigator, {
        share: shareMock,
      });

      const { result } = renderHook(() => useSummaryActions(mockSummary));

      await act(async () => {
        await result.current.handleShare();
      });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('handleSave', () => {
    it('should save summary successfully', async () => {
      const mockSavedSummary = {
        id: 1,
        content: mockSummary.content,
        keywords: ['tech', 'innovation'],
        url: mockSummary.url,
        title: mockSummary.title,
        created_at: new Date().toISOString(),
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockSavedSummary,
      }) as any;

      const { result } = renderHook(() => useSummaryActions(mockSummary));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/summaries'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(toast.success).toHaveBeenCalledWith('summarySavedSuccessMessage');
    });

    it('should handle save failure', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Server error',
      }) as any;

      const { result } = renderHook(() => useSummaryActions(mockSummary));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(toast.error).toHaveBeenCalledWith('summarySavedFailureMessage');
      consoleErrorSpy.mockRestore();
    });

    it('should handle network errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error')) as any;

      const { result } = renderHook(() => useSummaryActions(mockSummary));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(toast.error).toHaveBeenCalledWith('summarySavedFailureMessage');
      consoleErrorSpy.mockRestore();
    });
  });
});

