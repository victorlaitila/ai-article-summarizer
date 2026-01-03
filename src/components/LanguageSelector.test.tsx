import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LanguageSelector from './LanguageSelector';
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

vi.mock('react-country-flag', () => ({
  default: ({ countryCode }: { countryCode: string }) => (
    <span data-testid={`flag-${countryCode}`}>Flag</span>
  ),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
};

describe('LanguageSelector', () => {
  it('renders the language selector', () => {
    renderWithProviders(<LanguageSelector />);

    const combobox = screen.getByRole('combobox');
    expect(combobox).toBeInTheDocument();
  });

  it('displays the current language', () => {
    renderWithProviders(<LanguageSelector />);

    // The selector should show "English" by default
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('shows country flags', () => {
    const { getAllByTestId } = renderWithProviders(<LanguageSelector />);
    const flags = getAllByTestId('flag-US');
    // One flag for the select trigger and one in the dropdown list
    expect(flags.length).toBe(2);
  });
});
