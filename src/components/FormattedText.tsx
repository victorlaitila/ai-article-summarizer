import { useKeywords } from "../contexts/KeywordContext";
import { KEYWORD_STYLES } from "../constants";

// Formats text by highlighting selected keywords in different colors.
export function FormattedText({text}: {text: string}) {
  const { generatedKeywords, selectedKeywords } = useKeywords();

  if (selectedKeywords.length === 0) {
    return [text];
  }

  // Create a consistent map of keyword -> color based on generatedKeywords order
  const keywordColorMap: Record<string, string> = {};
  generatedKeywords.forEach((keyword, index) => {
    keywordColorMap[keyword.toLowerCase()] = KEYWORD_STYLES[index % KEYWORD_STYLES.length].highlight;
  });

  // Escape regex special characters in keywords
  const escapedKeywords = selectedKeywords.map(k =>
    k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );

  // Whole-word regex
  const regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const lowerPart = part.toLowerCase();
    if (selectedKeywords.some(k => k.toLowerCase() === lowerPart)) {
      const color = keywordColorMap[lowerPart];
      return (
        <span key={index} className={`${color} rounded px-0.5`}>
          {part}
        </span>
      );
    }
    return part;
  });
}

