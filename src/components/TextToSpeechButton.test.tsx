import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextToSpeechButton from './TextToSpeechButton';

vi.mock('../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: vi.fn(() => ({
    isSpeaking: false,
    activeText: '',
    startTTS: vi.fn(),
    stopTTS: vi.fn(),
  })),
}));

describe('TextToSpeechButton', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'speechSynthesis', {
      writable: true,
      value: {},
    });
  });

  it('renders the button when speechSynthesis is supported', () => {
    render(<TextToSpeechButton text="Test text" />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Listen');
  });

  it('shows play icon when not speaking', () => {
    render(<TextToSpeechButton text="Test text" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-100', 'text-blue-700');
  });
});
