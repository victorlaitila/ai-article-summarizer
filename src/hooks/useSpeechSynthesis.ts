import { useState, useCallback, useEffect, useRef } from "react";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeText, setActiveText] = useState<string | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[] | null>(null);

  const startTTS = useCallback((text: string, lang = "en-US") => {
    if (!text.trim()) {
      return;
    }

    setIsSpeaking(true);
    setActiveText(text);

    // Stop any current speech and create a new utterance
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const voices = voicesRef.current || window.speechSynthesis.getVoices() || [];
    const defaultVoice = voices.find(v => v.name === "Google US English") || voices[0];
    if (defaultVoice) {
      utterance.voice = defaultVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveText(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveText(null);
    };

    window.speechSynthesis.speak(utterance);
  }, []);
  
  const stopTTS = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveText(null);
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices() || [];
    };

    loadVoices();
    window.addEventListener("beforeunload", stopTTS);

    return () => {
      window.removeEventListener("beforeunload", stopTTS);
    };
  }, [stopTTS]);

  return { isSpeaking, activeText, startTTS, stopTTS };
}
