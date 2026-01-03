import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewToggler from './ViewToggler';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('ViewToggler', () => {
  it('renders both view buttons', () => {
    const mockSetShowSavedSummaries = vi.fn();

    render(
      <ViewToggler
        showSavedSummaries={false}
        setShowSavedSummaries={mockSetShowSavedSummaries}
      />
    );

    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /saved/i })).toBeInTheDocument();
  });

  it('highlights the generator button when showSavedSummaries is false', () => {
    const mockSetShowSavedSummaries = vi.fn();

    render(
      <ViewToggler
        showSavedSummaries={false}
        setShowSavedSummaries={mockSetShowSavedSummaries}
      />
    );

    const generateButton = screen.getByRole('button', { name: /generate/i });
    expect(generateButton).toHaveClass('text-blue-600', 'font-semibold');
  });

  it('highlights the saved button when showSavedSummaries is true', () => {
    const mockSetShowSavedSummaries = vi.fn();

    render(
      <ViewToggler
        showSavedSummaries={true}
        setShowSavedSummaries={mockSetShowSavedSummaries}
      />
    );

    const savedButton = screen.getByRole('button', { name: /saved/i });
    expect(savedButton).toHaveClass('text-blue-600', 'font-semibold');
  });

  it('calls setShowSavedSummaries(false) when generator button is clicked', async () => {
    const user = userEvent.setup();
    const mockSetShowSavedSummaries = vi.fn();

    render(
      <ViewToggler
        showSavedSummaries={true}
        setShowSavedSummaries={mockSetShowSavedSummaries}
      />
    );

    const generateButton = screen.getByRole('button', { name: /generate/i });
    await user.click(generateButton);

    expect(mockSetShowSavedSummaries).toHaveBeenCalledWith(false);
  });

  it('calls setShowSavedSummaries(true) when saved button is clicked', async () => {
    const user = userEvent.setup();
    const mockSetShowSavedSummaries = vi.fn();

    render(
      <ViewToggler
        showSavedSummaries={false}
        setShowSavedSummaries={mockSetShowSavedSummaries}
      />
    );

    const savedButton = screen.getByRole('button', { name: /saved/i });
    await user.click(savedButton);

    expect(mockSetShowSavedSummaries).toHaveBeenCalledWith(true);
  });
});
