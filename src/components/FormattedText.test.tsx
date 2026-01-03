import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { FormattedText } from './FormattedText';
import { KeywordProvider } from '../contexts/KeywordContext';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const renderWithKeywordContext = (
  ui: React.ReactElement,
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <KeywordProvider>{children}</KeywordProvider>
  );
  return render(ui, { wrapper: Wrapper });
};

describe('FormattedText', () => {
  it('renders text content correctly', () => {
    const testText = 'Test text.';
    
    const { container } = renderWithKeywordContext(
      <div>
        <FormattedText text={testText} />
      </div>
    );

    expect(container).toHaveTextContent(testText);
  });
});
