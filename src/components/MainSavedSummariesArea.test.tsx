import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MainSavedSummariesArea from './MainSavedSummariesArea';
import { SavedSummariesProvider } from '../contexts/SavedSummariesContext';
import { KeywordProvider } from '../contexts/KeywordContext';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: vi.fn(() => ({
    isSpeaking: false,
    activeText: '',
    startTTS: vi.fn(),
    stopTTS: vi.fn(),
  })),
}));

vi.mock('../hooks/useSummaryActions', () => ({
  useSummaryActions: vi.fn(() => ({
    handleOpenLink: vi.fn(),
    handleCopy: vi.fn(),
    handleDownload: vi.fn(),
    handleShare: vi.fn(),
    handleSave: vi.fn(),
  })),
}));

vi.mock('../utils/language', () => ({
  detectBCPLang: vi.fn(() => 'en-US'),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {},
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <KeywordProvider>
      <SavedSummariesProvider>{ui}</SavedSummariesProvider>
    </KeywordProvider>
  );
};

describe('MainSavedSummariesArea', () => {
  it('shows placeholder when no summaries are saved', () => {
    renderWithProviders(<MainSavedSummariesArea />);

    expect(screen.getByText('noSavedSummaries')).toBeInTheDocument();
  });

  it('displays the no saved summaries image', () => {
    renderWithProviders(<MainSavedSummariesArea />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
  });
});
