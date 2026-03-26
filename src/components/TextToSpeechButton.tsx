import { Volume2, VolumeX } from "lucide-react";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";

interface TextToSpeechButtonProps {
  text: string;
  lang?: string; // BCP 47 language code
}

export default function TextToSpeechButton({ text, lang = "en-US" }: TextToSpeechButtonProps) {
  const { isSpeaking, activeText, startTTS, stopTTS } = useSpeechSynthesis();
  const isThisSpeaking = isSpeaking && activeText === text;

  const handleClick = () => {
    if (isThisSpeaking) {
      stopTTS();
    } else {
      startTTS(text, lang);
    }
  };

  if (!("speechSynthesis" in window)) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className={`cursor-pointer inline-flex items-center justify-center align-middle ml-1.5 rounded-full shadow-sm
        ${isThisSpeaking
          ? "bg-red-100 hover:bg-red-200 text-red-600"
          : "bg-blue-100 hover:bg-blue-200 text-blue-700"
        }`}
      title={isThisSpeaking ? "Stop" : "Listen"}
    >
      {isThisSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}
