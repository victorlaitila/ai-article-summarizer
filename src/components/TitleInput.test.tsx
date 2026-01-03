import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TitleInput from './TitleInput';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('TitleInput', () => {
  it('renders the title input field', () => {
    const mockSetTitle = vi.fn();
    render(<TitleInput title="" setTitle={mockSetTitle} />);

    expect(screen.getByPlaceholderText('titlePlaceholder')).toBeInTheDocument();
  });

  it('displays the current title value', () => {
    const mockSetTitle = vi.fn();
    render(<TitleInput title="My Article Title" setTitle={mockSetTitle} />);

    const input = screen.getByPlaceholderText('titlePlaceholder') as HTMLInputElement;
    expect(input.value).toBe('My Article Title');
  });

  it('shows placeholder text', () => {
    const mockSetTitle = vi.fn();
    render(<TitleInput title="" setTitle={mockSetTitle} />);

    expect(screen.getByPlaceholderText('titlePlaceholder')).toBeInTheDocument();
  });

  it('calls setTitle when user types', async () => {
    const user = userEvent.setup();
    const mockSetTitle = vi.fn();
    render(<TitleInput title="" setTitle={mockSetTitle} />);

    const input = screen.getByPlaceholderText('titlePlaceholder');
    await user.type(input, 'New Title');

    expect(mockSetTitle).toHaveBeenCalled();
  });

  it('updates value on change', async () => {
    const user = userEvent.setup();
    const mockSetTitle = vi.fn();
    render(<TitleInput title="" setTitle={mockSetTitle} />);

    const input = screen.getByPlaceholderText('titlePlaceholder');
    await user.type(input, 'Test');

    expect(mockSetTitle).toHaveBeenCalledTimes(4); // Once for each character
  });

  it('renders label with correct text', () => {
    const mockSetTitle = vi.fn();
    render(<TitleInput title="" setTitle={mockSetTitle} />);

    expect(screen.getByText('title')).toBeInTheDocument();
  });
});
