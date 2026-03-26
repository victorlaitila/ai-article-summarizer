import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Summary from './Summary';
import { KeywordProvider } from '../contexts/KeywordContext';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ children }: any) => <div>{children}</div>,
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

vi.mock('../constants', () => ({
  USE_MOCK_API: false,
}));

Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {},
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<KeywordProvider>{ui}</KeywordProvider>);
};

describe('Summary', () => {
  const mockSummary = 'This is a test summary of the article content.';
  const mockTitle = 'Test Article Title';
  const mockSetShowArticle = vi.fn();

  it('renders the summary title and content', () => {
    renderWithProviders(
      <Summary 
        summary={mockSummary} 
        summaryTitle={mockTitle} 
        showArticle={false}
        setShowArticle={mockSetShowArticle}
      />
    );
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
    expect(screen.getByText(mockSummary)).toBeInTheDocument();
  });

  it('renders text-to-speech button', () => {
    renderWithProviders(
      <Summary 
        summary={mockSummary}
        showArticle={false}
        setShowArticle={mockSetShowArticle}
      />
    );

    const ttsButton = screen.getByRole('button', { name: /listen/i });
    expect(ttsButton).toBeInTheDocument();
  });

  it('displays keywords when provided', () => {
    const keywords = ['technology', 'innovation', 'future'];
    
    renderWithProviders(
      <Summary summary={mockSummary} summaryKeywords={keywords} />
    );

    // Keywords should be rendered as buttons
    keywords.forEach(keyword => {
      expect(screen.getByText(keyword)).toBeInTheDocument();
    });
  });

  it('handles empty keywords array', () => {
    renderWithProviders(
      <Summary summary={mockSummary} summaryKeywords={[]} />
    );

    expect(screen.getByText(mockSummary)).toBeInTheDocument();
  });

  it('renders in a card content container', () => {
    const { container } = renderWithProviders(<Summary summary={mockSummary} />);

    const cardContent = container.querySelector('[data-slot="card-content"]');
    expect(cardContent).toBeInTheDocument();
  });

  it('handles keyword button clicks', async () => {
    const user = userEvent.setup();
    const keywords = ['test'];

    renderWithProviders(
      <Summary summary={mockSummary} summaryKeywords={keywords} />
    );

    const keywordButton = screen.getByText('test');
    await user.click(keywordButton);

    // Button should still be in the document after click
    expect(keywordButton).toBeInTheDocument();
  });
});
