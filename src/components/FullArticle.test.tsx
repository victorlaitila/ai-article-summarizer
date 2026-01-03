import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FullArticle from './FullArticle';
import { KeywordProvider } from '../contexts/KeywordContext';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../utils/language', () => ({
  detectBCPLang: vi.fn(() => 'en-US'),
}));

vi.mock('../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: vi.fn(() => ({
    isSpeaking: false,
    activeText: '',
    startTTS: vi.fn(),
    stopTTS: vi.fn(),
  })),
}));

Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {},
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<KeywordProvider>{ui}</KeywordProvider>);
};

describe('FullArticle', () => {
  it('renders the article text', () => {
    const articleText = 'This is the full article content that should be displayed.';

    renderWithProviders(<FullArticle article={articleText} />);

    expect(screen.getByText(articleText)).toBeInTheDocument();
  });

  it('renders the text-to-speech button', () => {
    const articleText = 'Article with TTS support.';

    renderWithProviders(<FullArticle article={articleText} />);

    const ttsButton = screen.getByRole('button');
    expect(ttsButton).toBeInTheDocument();
  });

  it('renders in a card content container', () => {
    const articleText = 'Sample article';

    const { container } = renderWithProviders(<FullArticle article={articleText} />);

    const cardContent = container.querySelector('.bg-indigo-50');
    expect(cardContent).toBeInTheDocument();
  });
});
