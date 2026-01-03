import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ModeSelector from './ModeSelector';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('ModeSelector', () => {
  it('renders the mode selector with label', () => {
    const mockSetSummaryMode = vi.fn();

    render(
      <ModeSelector
        summaryMode="default"
        setSummaryMode={mockSetSummaryMode}
      />
    );

    expect(screen.getByText('summaryMode')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays the current selected mode', () => {
    const mockSetSummaryMode = vi.fn();

    render(
      <ModeSelector
        summaryMode="bullets"
        setSummaryMode={mockSetSummaryMode}
      />
    );

    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });
});
