import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MainGeneratorArea from './MainGeneratorArea';
import { KeywordProvider } from '../contexts/KeywordContext';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../hooks/useContentHandler', () => ({
  useContentHandler: vi.fn(() => ({
    handleGenerate: vi.fn(),
  })),
}));

vi.mock('../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: vi.fn(() => ({
    stopTTS: vi.fn(),
    isSpeaking: false,
    activeText: '',
    startTTS: vi.fn(),
  })),
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
  return render(<KeywordProvider>{ui}</KeywordProvider>);
};

describe('MainGeneratorArea', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main generator interface', () => {
    renderWithProviders(<MainGeneratorArea />);

    expect(screen.getByText('description')).toBeInTheDocument();
  });

  it('renders source selector', () => {
    renderWithProviders(<MainGeneratorArea />);

    expect(screen.getByRole('button', { name: /URL/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /text/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /file/i })).toBeInTheDocument();
  });

  it('renders URL input by default', () => {
    renderWithProviders(<MainGeneratorArea />);

    expect(screen.getByPlaceholderText('urlPlaceholder')).toBeInTheDocument();
  });

  it('switches to text input when text source is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MainGeneratorArea />);

    const textButton = screen.getByRole('button', { name: /text/i });
    await user.click(textButton);

    expect(screen.getByPlaceholderText('textAreaPlaceholder')).toBeInTheDocument();
  });

  it('switches to file input when file source is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MainGeneratorArea />);

    const fileButton = screen.getByRole('button', { name: /file/i });
    await user.click(fileButton);

    expect(screen.getByText('uploadFile')).toBeInTheDocument();
  });

  it('renders mode selector', () => {
    renderWithProviders(<MainGeneratorArea />);

    expect(screen.getByText('summaryMode')).toBeInTheDocument();
  });

  it('renders generator button', () => {
    renderWithProviders(<MainGeneratorArea />);

    expect(screen.getByRole('button', { name: /generateSummary/i })).toBeInTheDocument();
  });

  it('disables generate button when no input is provided', () => {
    renderWithProviders(<MainGeneratorArea />);

    const generateButton = screen.getByRole('button', { name: /generateSummary/i });
    expect(generateButton).toBeDisabled();
  });

  it('enables generate button when URL is provided', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MainGeneratorArea />);

    const urlInput = screen.getByPlaceholderText('urlPlaceholder');
    await user.type(urlInput, 'https://example.com');

    const generateButton = screen.getByRole('button', { name: /generateSummary/i });
    expect(generateButton).not.toBeDisabled();
  });

  it('renders summary placeholder initially', () => {
    renderWithProviders(<MainGeneratorArea />);

    expect(screen.getByText('readyToSummarize')).toBeInTheDocument();
  });
});
