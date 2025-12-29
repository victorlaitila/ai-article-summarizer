import { franc } from 'franc-min';

// Map franc ISO 639-3 codes to BCP 47 tags for browsers
const langMap: Record<string, string> = {
  eng: "en-US",
  swe: "sv-SE",
  fin: "fi-FI",
};

export function detectBCPLang(text: string): string {
  return langMap[franc(text)] || "en-US";
}