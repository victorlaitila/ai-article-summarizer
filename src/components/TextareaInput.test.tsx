import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextareaInput from './TextareaInput';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('TextareaInput', () => {
  it('renders the textarea with label', () => {
    const mockSetText = vi.fn();

    render(<TextareaInput text="" setText={mockSetText} />);

    expect(screen.getByText('textAreaDescription')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('textAreaPlaceholder')).toBeInTheDocument();
  });

  it('displays the current text value', () => {
    const mockSetText = vi.fn();
    const testText = 'This is a sample article text that needs to be summarized.';

    render(<TextareaInput text={testText} setText={mockSetText} />);

    const textarea = screen.getByPlaceholderText('textAreaPlaceholder') as HTMLTextAreaElement;
    expect(textarea.value).toBe(testText);
  });

  it('calls setText when user types in the textarea', async () => {
    const user = userEvent.setup();
    const mockSetText = vi.fn();

    render(<TextareaInput text="" setText={mockSetText} />);

    const textarea = screen.getByPlaceholderText('textAreaPlaceholder');
    await user.type(textarea, 'New text');

    expect(mockSetText).toHaveBeenCalled();
    expect(mockSetText).toHaveBeenCalledTimes(8); // Once per character
  });

  it('handles empty text', () => {
    const mockSetText = vi.fn();

    render(<TextareaInput text="" setText={mockSetText} />);

    const textarea = screen.getByPlaceholderText('textAreaPlaceholder') as HTMLTextAreaElement;
    expect(textarea.value).toBe('');
  });

  it('handles multiline text', () => {
    const mockSetText = vi.fn();
    const multilineText = 'Line 1\nLine 2\nLine 3';

    render(<TextareaInput text={multilineText} setText={mockSetText} />);

    const textarea = screen.getByPlaceholderText('textAreaPlaceholder') as HTMLTextAreaElement;
    expect(textarea.value).toBe(multilineText);
  });
});
