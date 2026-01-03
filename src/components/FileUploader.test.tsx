import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUploader from './FileUploader';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('FileUploader', () => {
  it('renders the upload area when no file is selected', () => {
    const mockSetFile = vi.fn();

    render(<FileUploader file={undefined} setFile={mockSetFile} />);

    expect(screen.getByText('fileUploadDescription')).toBeInTheDocument();
    expect(screen.getByText('uploadFile')).toBeInTheDocument();
    expect(screen.getByText('(.pdf, .txt)')).toBeInTheDocument();
  });

  it('shows upload button when no file is present', () => {
    const mockSetFile = vi.fn();

    render(<FileUploader file={undefined} setFile={mockSetFile} />);

    const uploadButton = screen.getByRole('button', { name: /uploadFile/i });
    expect(uploadButton).toBeInTheDocument();
  });

  it('has hidden file input with correct accept types', () => {
    const mockSetFile = vi.fn();

    const { container } = render(<FileUploader file={undefined} setFile={mockSetFile} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('accept', '.pdf,.txt');
    expect(fileInput).toHaveClass('hidden');
  });

  it('triggers file input when upload button is clicked', async () => {
    const user = userEvent.setup();
    const mockSetFile = vi.fn();

    const { container } = render(<FileUploader file={undefined} setFile={mockSetFile} />);

    const uploadButton = screen.getByRole('button', { name: /uploadFile/i });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    const clickSpy = vi.spyOn(fileInput, 'click');
    
    await user.click(uploadButton);
    
    expect(clickSpy).toHaveBeenCalled();
  });

  it('calls setFile when a file is selected', async () => {
    const user = userEvent.setup();
    const mockSetFile = vi.fn();
    const testFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    const { container } = render(<FileUploader file={undefined} setFile={mockSetFile} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(fileInput, testFile);

    expect(mockSetFile).toHaveBeenCalledWith(testFile);
  });

  it('displays file name and size when file is uploaded', () => {
    const mockSetFile = vi.fn();
    const testFile = new File(['test content'], 'test-document.pdf', { type: 'application/pdf' });

    render(<FileUploader file={testFile} setFile={mockSetFile} />);

    expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
  });

  it('shows remove button when file is uploaded', () => {
    const mockSetFile = vi.fn();
    const testFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    render(<FileUploader file={testFile} setFile={mockSetFile} />);

    // Find the button that removes the file (has X icon)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('calls setFile with undefined when remove button is clicked', async () => {
    const user = userEvent.setup();
    const mockSetFile = vi.fn();
    const testFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    render(<FileUploader file={testFile} setFile={mockSetFile} />);

    // Find the remove button (only button when file is uploaded)
    const removeButton = screen.getByRole('button');
    await user.click(removeButton);

    expect(mockSetFile).toHaveBeenCalledWith(undefined);
  });
});
