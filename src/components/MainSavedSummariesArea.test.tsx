import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import MainSavedSummariesArea from './MainSavedSummariesArea';
import { KeywordProvider } from '../contexts/KeywordContext';
import type { SavedSummary } from '../types';

// Mock saved summaries context
const mockSetSavedSummaries = vi.fn();
let mockSavedSummaries: SavedSummary[] = [];

vi.mock('../contexts/SavedSummariesContext', () => ({
  useSavedSummaries: () => ({
    savedSummaries: mockSavedSummaries,
    setSavedSummaries: mockSetSavedSummaries,
    fetchSavedSummaries: vi.fn(),
    addSavedSummary: vi.fn(),
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: vi.fn(() => ({
    isSpeaking: false,
    activeText: '',
    startTTS: vi.fn(),
    stopTTS: vi.fn(),
  })),
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

vi.mock('../utils/language', () => ({
  detectBCPLang: vi.fn(() => 'en-US'),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../constants', () => ({
  USE_MOCK_API: true,
}));

Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {},
});

const testSummaries: SavedSummary[] = [
  {
    id: 1,
    content: 'Summary about solar panels',
    keywords: ['solar', 'energy', 'renewable'],
    title: 'Solar Panel Technology',
    created_at: '2025-11-14T14:33:43.626257+00:00',
  },
  {
    id: 2,
    content: 'Summary about AI healthcare',
    keywords: ['AI', 'healthcare', 'diagnosis'],
    title: 'AI in Medical Diagnosis',
    created_at: '2025-12-22T10:56:11.626257+00:00',
  },
  {
    id: 3,
    content: 'Summary about wind energy',
    keywords: ['wind', 'energy', 'offshore'],
    title: 'Offshore Wind Farms',
    created_at: '2025-12-28T18:28:03.626257+00:00',
  },
];

const renderComponent = (summaries: SavedSummary[] = []) => {
  mockSavedSummaries = summaries;
  return render(
    <KeywordProvider>
      <MainSavedSummariesArea />
    </KeywordProvider>
  );
};

describe('MainSavedSummariesArea', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSavedSummaries = [];
  });

  it('shows placeholder when no summaries are saved', () => {
    renderComponent();

    expect(screen.getByText('noSavedSummaries')).toBeInTheDocument();
  });

  it('displays the no saved summaries image', () => {
    renderComponent();

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
  });

  it('displays search and sort controls when summaries exist', () => {
    renderComponent(testSummaries);

    expect(screen.getByPlaceholderText('searchSummaries')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sort/i })).toBeInTheDocument();
  });

  it('does not display search and sort controls when no summaries exist', () => {
    renderComponent();

    expect(screen.queryByPlaceholderText('searchSummaries')).not.toBeInTheDocument();
  });

  it('displays all summaries initially', () => {
    renderComponent(testSummaries);

    expect(screen.getByText('Solar Panel Technology')).toBeInTheDocument();
    expect(screen.getByText('AI in Medical Diagnosis')).toBeInTheDocument();
    expect(screen.getByText('Offshore Wind Farms')).toBeInTheDocument();
  });

  it('filters summaries by title', async () => {
    const user = userEvent.setup();
    renderComponent(testSummaries);

    const searchInput = screen.getByPlaceholderText('searchSummaries');
    await user.type(searchInput, 'Solar');

    await waitFor(() => {
      expect(screen.getByText('Solar Panel Technology')).toBeInTheDocument();
      expect(screen.queryByText('AI in Medical Diagnosis')).not.toBeInTheDocument();
      expect(screen.queryByText('Offshore Wind Farms')).not.toBeInTheDocument();
    });
  });

  it('filters summaries by keyword', async () => {
    const user = userEvent.setup();
    renderComponent(testSummaries);

    const searchInput = screen.getByPlaceholderText('searchSummaries');
    await user.type(searchInput, 'healthcare');

    await waitFor(() => {
      expect(screen.queryByText('Solar Panel Technology')).not.toBeInTheDocument();
      expect(screen.getByText('AI in Medical Diagnosis')).toBeInTheDocument();
      expect(screen.queryByText('Offshore Wind Farms')).not.toBeInTheDocument();
    });
  });

  it('shows no matching results message when search has no matches', async () => {
    const user = userEvent.setup();
    renderComponent(testSummaries);

    const searchInput = screen.getByPlaceholderText('searchSummaries');
    await user.type(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText('noMatchingResults')).toBeInTheDocument();
      expect(screen.queryByText('Solar Panel Technology')).not.toBeInTheDocument();
    });
  });

  it('displays summaries in descending order by default (newest first)', () => {
    renderComponent(testSummaries);

    const summaryCards = screen.getAllByRole('heading', { level: 4 });
    // Find the date headings (they have text-muted-foreground class)
    const dateHeadings = summaryCards.filter(h => h.textContent?.includes('2025'));
    // The newest summary should be first (Dec 28)
    expect(dateHeadings[0]).toHaveTextContent('Dec 28');
  });

  it('toggles sort order when clicking sort button', async () => {
    const user = userEvent.setup();
    renderComponent(testSummaries);

    const sortButton = screen.getByRole('button', { name: /sort/i });
    await user.click(sortButton);

    await waitFor(() => {
      const summaryCards = screen.getAllByRole('heading', { level: 4 });
      const dateHeadings = summaryCards.filter(h => h.textContent?.includes('2025'));
      // After toggling to ascending, oldest should be first (Nov 14)
      expect(dateHeadings[0]).toHaveTextContent('Nov 14');
    });
  });

  it('combines search and sort functionality', async () => {
    const user = userEvent.setup();
    const multipleSummaries: SavedSummary[] = [
      {
        id: 1,
        content: 'Old energy summary',
        keywords: ['energy'],
        title: 'Old Energy Article',
        created_at: '2025-11-01T10:00:00.000Z',
      },
      {
        id: 2,
        content: 'New energy summary',
        keywords: ['energy'],
        title: 'New Energy Article',
        created_at: '2025-12-01T10:00:00.000Z',
      },
      {
        id: 3,
        content: 'Healthcare summary',
        keywords: ['healthcare'],
        title: 'Healthcare Article',
        created_at: '2025-11-15T10:00:00.000Z',
      },
    ];

    renderComponent(multipleSummaries);

    // Search for "energy"
    const searchInput = screen.getByPlaceholderText('searchSummaries');
    await user.type(searchInput, 'energy');

    await waitFor(() => {
      expect(screen.getByText('Old Energy Article')).toBeInTheDocument();
      expect(screen.getByText('New Energy Article')).toBeInTheDocument();
      expect(screen.queryByText('Healthcare Article')).not.toBeInTheDocument();
    });

    // Toggle to ascending order
    const sortButton = screen.getByRole('button', { name: /sort/i });
    await user.click(sortButton);

    await waitFor(() => {
      const titles = screen.getAllByText(/Energy Article/);
      // Old Energy Article should come first when sorted ascending
      expect(titles[0]).toHaveTextContent('Old Energy Article');
    });
  });

  it('clears search when clicking clear button', async () => {
    const user = userEvent.setup();
    renderComponent(testSummaries);

    const searchInput = screen.getByPlaceholderText('searchSummaries');
    await user.type(searchInput, 'Solar');

    await waitFor(() => {
      expect(screen.getByText('Solar Panel Technology')).toBeInTheDocument();
      expect(screen.queryByText('AI in Medical Diagnosis')).not.toBeInTheDocument();
    });

    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    await waitFor(() => {
      // All summaries should be visible again
      expect(screen.getByText('Solar Panel Technology')).toBeInTheDocument();
      expect(screen.getByText('AI in Medical Diagnosis')).toBeInTheDocument();
      expect(screen.getByText('Offshore Wind Farms')).toBeInTheDocument();
    });
  });

  it('performs case-insensitive search', async () => {
    const user = userEvent.setup();
    renderComponent(testSummaries);

    const searchInput = screen.getByPlaceholderText('searchSummaries');
    await user.type(searchInput, 'SOLAR');

    await waitFor(() => {
      expect(screen.getByText('Solar Panel Technology')).toBeInTheDocument();
    });
  });
});
