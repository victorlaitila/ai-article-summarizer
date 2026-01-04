import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpeechSynthesis } from './useSpeechSynthesis';

describe('useSpeechSynthesis', () => {
  let mockSpeechSynthesis: any;
  let mockUtterance: any;
  let onendCallback: (() => void) | null = null;
  let onerrorCallback: (() => void) | null = null;

  beforeEach(() => {
    // Mock SpeechSynthesisUtterance
    mockUtterance = {
      text: '',
      lang: '',
      voice: null,
      onend: null,
      onerror: null,
    };

    globalThis.SpeechSynthesisUtterance = vi.fn((text: string) => {
      mockUtterance.text = text;
      // Store callbacks when set
      Object.defineProperty(mockUtterance, 'onend', {
        set: (fn) => { onendCallback = fn; },
        get: () => onendCallback,
        configurable: true,
      });
      Object.defineProperty(mockUtterance, 'onerror', {
        set: (fn) => { onerrorCallback = fn; },
        get: () => onerrorCallback,
        configurable: true,
      });
      return mockUtterance;
    }) as any;

    // Mock speechSynthesis API
    mockSpeechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => [
        { name: 'Voice 1', lang: 'en-US' },
        { name: 'Google US English', lang: 'en-US' },
      ]),
    };

    Object.defineProperty(window, 'speechSynthesis', {
      value: mockSpeechSynthesis,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    onendCallback = null;
    onerrorCallback = null;
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.activeText).toBeNull();
  });

  it('should start text-to-speech with provided text', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.startTTS('Hello world');
    });

    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    expect(result.current.isSpeaking).toBe(true);
    expect(result.current.activeText).toBe('Hello world');
  });

  it('should not start TTS with empty text', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.startTTS('   ');
    });

    expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled();
    expect(result.current.isSpeaking).toBe(false);
  });

  it('should set custom language', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.startTTS('Hola mundo', 'es-ES');
    });

    expect(mockUtterance.lang).toBe('es-ES');
  });

  it('should prefer "Google US English" voice if available', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.startTTS('Test text');
    });

    expect(mockUtterance.voice?.name).toBe('Google US English');
  });

  it('should stop text-to-speech', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.startTTS('Hello world');
    });

    expect(result.current.isSpeaking).toBe(true);

    act(() => {
      result.current.stopTTS();
    });

    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.activeText).toBeNull();
  });

  it('should reset state when speech ends naturally', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.startTTS('Hello world');
    });

    expect(result.current.isSpeaking).toBe(true);

    // Simulate speech ending
    act(() => {
      if (onendCallback) onendCallback();
    });

    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.activeText).toBeNull();
  });

  it('should reset state when speech encounters error', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.startTTS('Hello world');
    });

    expect(result.current.isSpeaking).toBe(true);

    // Simulate speech error
    act(() => {
      if (onerrorCallback) onerrorCallback();
    });

    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.activeText).toBeNull();
  });

  it('should cancel existing speech before starting new one', () => {
    const { result } = renderHook(() => useSpeechSynthesis());

    act(() => {
      result.current.startTTS('First text');
    });

    act(() => {
      result.current.startTTS('Second text');
    });

    expect(mockSpeechSynthesis.cancel).toHaveBeenCalledTimes(2); // Once for each startTTS call
  });

  it('should add beforeunload listener on mount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

    renderHook(() => useSpeechSynthesis());

    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('should remove beforeunload listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useSpeechSynthesis());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });
});
