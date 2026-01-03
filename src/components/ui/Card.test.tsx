import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders card with children', () => {
      const { container } = render(<Card>Card content</Card>);

      expect(container.firstChild).toHaveClass('rounded-xl', 'bg-card');
      expect(container).toHaveTextContent('Card content');
    });

    it('applies custom className', () => {
      const { container } = render(<Card className="custom-card">Content</Card>);

      expect(container.firstChild).toHaveClass('custom-card');
    });
  });

  describe('CardHeader', () => {
    it('renders card header with children', () => {
      const { container } = render(<CardHeader>Header content</CardHeader>);

      expect(container.firstChild).toHaveClass('grid', 'px-6', 'pt-6');
      expect(container).toHaveTextContent('Header content');
    });

    it('applies custom className', () => {
      const { container } = render(<CardHeader className="custom-header">Content</CardHeader>);

      expect(container.firstChild).toHaveClass('custom-header');
    });
  });

  describe('CardTitle', () => {
    it('renders card title as h4', () => {
      const { container } = render(<CardTitle>Title text</CardTitle>);

      const title = container.querySelector('h4');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Title text');
    });

    it('applies title styling classes', () => {
      const { container } = render(<CardTitle>Title</CardTitle>);

      const title = container.querySelector('h4');
      expect(title).toHaveClass('leading-none');
    });

    it('applies custom className', () => {
      const { container } = render(<CardTitle className="custom-title">Title</CardTitle>);

      const title = container.querySelector('h4');
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('CardContent', () => {
    it('renders card content with children', () => {
      const { container } = render(<CardContent>Body content</CardContent>);

      expect(container.firstChild).toHaveClass('px-6');
      expect(container).toHaveTextContent('Body content');
    });

    it('applies custom className', () => {
      const { container } = render(<CardContent className="custom-content">Content</CardContent>);

      expect(container.firstChild).toHaveClass('custom-content');
    });
  });

  describe('Card composition', () => {
    it('renders full card structure', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>Card body content</CardContent>
        </Card>
      );

      expect(container).toHaveTextContent('Card Title');
      expect(container).toHaveTextContent('Card body content');
    });
  });
});
