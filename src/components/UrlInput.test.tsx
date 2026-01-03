import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UrlInput from './UrlInput';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('UrlInput', () => {
  it('renders the input field with label', () => {
    const mockSetUrl = vi.fn();

    render(<UrlInput url="" setUrl={mockSetUrl} />);

    expect(screen.getByText('articleUrl')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('urlPlaceholder')).toBeInTheDocument();
  });

  it('displays the current url value', () => {
    const mockSetUrl = vi.fn();
    const testUrl = 'https://example.com/article';

    render(<UrlInput url={testUrl} setUrl={mockSetUrl} />);

    const input = screen.getByPlaceholderText('urlPlaceholder') as HTMLInputElement;
    expect(input.value).toBe(testUrl);
  });

  it('calls setUrl when user types in the input', async () => {
    const user = userEvent.setup();
    const mockSetUrl = vi.fn();

    render(<UrlInput url="" setUrl={mockSetUrl} />);

    const input = screen.getByPlaceholderText('urlPlaceholder');
    await user.type(input, 'https://test.com');

    expect(mockSetUrl).toHaveBeenCalled();
  });

  it('handles empty url', () => {
    const mockSetUrl = vi.fn();

    render(<UrlInput url="" setUrl={mockSetUrl} />);

    const input = screen.getByPlaceholderText('urlPlaceholder') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('has url input type', () => {
    const mockSetUrl = vi.fn();

    render(<UrlInput url="" setUrl={mockSetUrl} />);

    const input = screen.getByPlaceholderText('urlPlaceholder');
    expect(input).toHaveAttribute('type', 'url');
  });
});
