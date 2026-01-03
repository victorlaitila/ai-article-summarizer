import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NoSavedSummariesPlaceholder from './NoSavedSummariesPlaceholder';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('NoSavedSummariesPlaceholder', () => {
  it('renders the placeholder with heading and description', () => {
    render(<NoSavedSummariesPlaceholder />);

    expect(screen.getByRole('heading', { name: /noSavedSummaries/i })).toBeInTheDocument();
    expect(screen.getByText('noSavedSummariesDescription')).toBeInTheDocument();
  });

  it('renders the placeholder image', () => {
    render(<NoSavedSummariesPlaceholder />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'no-saved-summaries-placeholder.png');
    expect(image).toHaveAttribute('width', '600');
  });
});
