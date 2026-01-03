import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppHeader from './AppHeader';
import { LanguageProvider } from '../contexts/LanguageContext';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

vi.mock('lottie-react', () => ({
  default: () => <div>Gradient Animation</div>,
}));

vi.mock('react-country-flag', () => ({
  default: () => <span>Flag</span>,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
};

describe('AppHeader', () => {
  it('renders the header with title and main elements', () => {
    const mockSetShowSavedSummaries = vi.fn();

    renderWithProviders(
      <AppHeader
        showSavedSummaries={false}
        setShowSavedSummaries={mockSetShowSavedSummaries}
      />
    );

    // Check if the header is rendered using semantic query
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    // Check if the title text is rendered (translation keys)
    expect(screen.getByText('summary')).toBeInTheDocument();
    expect(screen.getByText('ai')).toBeInTheDocument();

    // Verify Gradient animation is present
    expect(screen.getByText('Gradient Animation')).toBeInTheDocument();
  });

  it('renders the view toggle buttons', () => {
    const mockSetShowSavedSummaries = vi.fn();

    renderWithProviders(
      <AppHeader
        showSavedSummaries={false}
        setShowSavedSummaries={mockSetShowSavedSummaries}
      />
    );

    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /saved/i })).toBeInTheDocument();
  });

  it('calls setShowSavedSummaries when toggling views', async () => {
    const user = userEvent.setup();
    const mockSetShowSavedSummaries = vi.fn();

    renderWithProviders(
      <AppHeader
        showSavedSummaries={false}
        setShowSavedSummaries={mockSetShowSavedSummaries}
      />
    );

    // Click the saved summaries button
    const savedButton = screen.getByRole('button', { name: /saved/i });
    await user.click(savedButton);

    expect(mockSetShowSavedSummaries).toHaveBeenCalledWith(true);
  });
});
