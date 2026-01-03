import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SummaryButtonGroup from './SummaryButtonGroup';
import type { TempSummary } from '../types';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../hooks/useSummaryActions', () => ({
  useSummaryActions: vi.fn(() => ({
    handleOpenLink: vi.fn(),
    handleCopy: vi.fn(),
    handleDownload: vi.fn(),
    handleShare: vi.fn(),
    handleSave: vi.fn(),
  })),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe('SummaryButtonGroup', () => {
  const mockSummary: TempSummary = {
    url: 'https://example.com',
    content: 'Test summary content',
  };

  it('renders all action buttons', () => {
    render(<SummaryButtonGroup summary={mockSummary} showSaveButton={false} />);

    // Check for buttons by their title attributes
    expect(screen.getByTitle('openLink')).toBeInTheDocument();
    expect(screen.getByTitle('copy')).toBeInTheDocument();
    expect(screen.getByTitle('download')).toBeInTheDocument();
    expect(screen.getByTitle('share')).toBeInTheDocument();
  });

  it('disables open link button when url is not provided', () => {
    const summaryWithoutUrl: TempSummary = {
      ...mockSummary,
      url: undefined,
    };

    render(<SummaryButtonGroup summary={summaryWithoutUrl} showSaveButton={false} />);

    const openLinkButton = screen.getByTitle('openLink');
    expect(openLinkButton).toBeDisabled();
  });

  it('enables open link button when url is provided', () => {
    render(<SummaryButtonGroup summary={mockSummary} showSaveButton={false} />);

    const openLinkButton = screen.getByTitle('openLink');
    expect(openLinkButton).not.toBeDisabled();
  });

  it('shows save button when showSaveButton is true', () => {
    render(<SummaryButtonGroup summary={mockSummary} showSaveButton={true} />);

    expect(screen.getByTitle('save')).toBeInTheDocument();
  });

  it('does not show save button when showSaveButton is false', () => {
    render(<SummaryButtonGroup summary={mockSummary} showSaveButton={false} />);

    expect(screen.queryByTitle('save')).not.toBeInTheDocument();
  });

  it('changes save button icon after clicking', async () => {
    const user = userEvent.setup();
    
    render(<SummaryButtonGroup summary={mockSummary} showSaveButton={true} />);

    const saveButton = screen.getByTitle('save');
    await user.click(saveButton);

    // After clicking, the button should be disabled (saved state)
    expect(saveButton).toBeDisabled();
  });
});
