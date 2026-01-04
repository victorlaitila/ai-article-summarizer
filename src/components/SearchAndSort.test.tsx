import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchAndSort from './SearchAndSort';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('SearchAndSort', () => {
  const mockSetSearchQuery = vi.fn();
  const mockToggleSortOrder = vi.fn();

  const defaultProps = {
    searchQuery: '',
    setSearchQuery: mockSetSearchQuery,
    sortOrder: 'desc' as const,
    toggleSortOrder: mockToggleSortOrder,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input with placeholder', () => {
    render(<SearchAndSort {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('searchSummaries');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders sort button', () => {
    render(<SearchAndSort {...defaultProps} />);
    
    const sortButton = screen.getByRole('button');
    expect(sortButton).toBeInTheDocument();
  });

  it('calls setSearchQuery when typing in search input', async () => {
    const user = userEvent.setup();
    render(<SearchAndSort {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('searchSummaries');
    await user.type(searchInput, 'test query');
    
    expect(mockSetSearchQuery).toHaveBeenCalled();
  });

  it('calls toggleSortOrder when clicking sort button', async () => {
    const user = userEvent.setup();
    render(<SearchAndSort {...defaultProps} />);
    
    const sortButton = screen.getByRole('button');
    await user.click(sortButton);
    
    expect(mockToggleSortOrder).toHaveBeenCalledTimes(1);
  });

  it('shows clear button when search query is not empty', () => {
    render(<SearchAndSort {...defaultProps} searchQuery="test" />);
    
    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('does not show clear button when search query is empty', () => {
    render(<SearchAndSort {...defaultProps} searchQuery="" />);
    
    const clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('calls setSearchQuery with empty string when clicking clear button', async () => {
    const user = userEvent.setup();
    render(<SearchAndSort {...defaultProps} searchQuery="test" />);
    
    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);
    
    expect(mockSetSearchQuery).toHaveBeenCalledWith('');
  });

  it('shows correct tooltip for desc sort order', () => {
    render(<SearchAndSort {...defaultProps} sortOrder="desc" />);
    
    const sortButton = screen.getByRole('button');
    expect(sortButton).toHaveAttribute('title', 'sortNewestFirst');
  });

  it('shows correct tooltip for asc sort order', () => {
    render(<SearchAndSort {...defaultProps} sortOrder="asc" />);
    
    const sortButton = screen.getByRole('button');
    expect(sortButton).toHaveAttribute('title', 'sortOldestFirst');
  });

  it('displays search icon in input', () => {
    const { container } = render(<SearchAndSort {...defaultProps} />);
    
    // Check for Search icon by looking for the svg element
    const searchIcon = container.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });
});
