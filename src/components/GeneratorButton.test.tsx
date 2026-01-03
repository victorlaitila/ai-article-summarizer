import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GeneratorButton from './GeneratorButton';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('GeneratorButton', () => {
  it('renders the button with default text when not generating', () => {
    const mockOnClick = vi.fn();

    render(
      <GeneratorButton
        onClick={mockOnClick}
        isGenerating={false}
        disabled={false}
      />
    );

    expect(screen.getByRole('button', { name: /generateSummary/i })).toBeInTheDocument();
  });

  it('shows generating state when isGenerating is true', () => {
    const mockOnClick = vi.fn();

    render(
      <GeneratorButton
        onClick={mockOnClick}
        isGenerating={true}
        disabled={false}
      />
    );

    expect(screen.getByText('generating')).toBeInTheDocument();
    // Check for spinner by its class (spinner is in the button)
    const button = screen.getByRole('button');
    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(
      <GeneratorButton
        onClick={mockOnClick}
        isGenerating={false}
        disabled={false}
      />
    );

    const button = screen.getByRole('button', { name: /generateSummary/i });
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnClick = vi.fn();

    render(
      <GeneratorButton
        onClick={mockOnClick}
        isGenerating={false}
        disabled={true}
      />
    );

    const button = screen.getByRole('button', { name: /generateSummary/i });
    expect(button).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(
      <GeneratorButton
        onClick={mockOnClick}
        isGenerating={false}
        disabled={true}
      />
    );

    const button = screen.getByRole('button', { name: /generateSummary/i });
    await user.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
