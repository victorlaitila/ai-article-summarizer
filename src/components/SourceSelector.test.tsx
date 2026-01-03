import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SourceSelector from './SourceSelector';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('SourceSelector', () => {
  it('renders all three source type buttons', () => {
    const mockSetSourceType = vi.fn();

    render(
      <SourceSelector
        sourceType="url"
        setSourceType={mockSetSourceType}
      />
    );

    expect(screen.getByRole('button', { name: /URL/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /text/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /file/i })).toBeInTheDocument();
  });

  it('highlights the selected source type', () => {
    const mockSetSourceType = vi.fn();

    render(
      <SourceSelector
        sourceType="text"
        setSourceType={mockSetSourceType}
      />
    );

    const textButton = screen.getByRole('button', { name: /text/i });
    expect(textButton).toHaveClass('ring-1', 'ring-blue-400');
  });

  it('calls setSourceType when a different source is clicked', async () => {
    const user = userEvent.setup();
    const mockSetSourceType = vi.fn();

    render(
      <SourceSelector
        sourceType="url"
        setSourceType={mockSetSourceType}
      />
    );

    const fileButton = screen.getByRole('button', { name: /file/i });
    await user.click(fileButton);

    expect(mockSetSourceType).toHaveBeenCalledWith('file');
  });

  it('handles clicking on each source type', async () => {
    const user = userEvent.setup();
    const mockSetSourceType = vi.fn();

    render(
      <SourceSelector
        sourceType="url"
        setSourceType={mockSetSourceType}
      />
    );

    await user.click(screen.getByRole('button', { name: /text/i }));
    expect(mockSetSourceType).toHaveBeenCalledWith('text');

    await user.click(screen.getByRole('button', { name: /file/i }));
    expect(mockSetSourceType).toHaveBeenCalledWith('file');

    await user.click(screen.getByRole('button', { name: /URL/i }));
    expect(mockSetSourceType).toHaveBeenCalledWith('url');
  });
});
