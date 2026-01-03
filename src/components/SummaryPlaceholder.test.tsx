import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SummaryPlaceholder from './SummaryPlaceholder';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('SummaryPlaceholder', () => {
  it('renders the placeholder card', () => {
    render(<SummaryPlaceholder />);

    expect(screen.getByText('readyToSummarize')).toBeInTheDocument();
  });

  it('displays the ready description', () => {
    render(<SummaryPlaceholder />);

    expect(screen.getByText('readyDescription')).toBeInTheDocument();
  });

  it('displays the disclaimer text', () => {
    render(<SummaryPlaceholder />);

    expect(screen.getByText('disclaimerText')).toBeInTheDocument();
  });

  it('renders the sparkles icon', () => {
    const { container } = render(<SummaryPlaceholder />);

    const icon = container.querySelector('.lucide-sparkles');
    expect(icon).toBeInTheDocument();
  });
});
