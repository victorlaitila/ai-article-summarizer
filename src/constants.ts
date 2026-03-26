export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";
export const ARTICLE_SUMMARY_FILENAME = "article-summary.txt";
export const ARTICLE_SUMMARY_SHARE_TITLE = "Article Summary";
export const TOAST_DURATION = 3000;

// Keyword styling colors used across the application
export const KEYWORD_STYLES = [
  { bg: "bg-yellow-200", hoverBg: "hover:bg-yellow-300", text: "text-yellow-900", ring: "ring-yellow-400", highlight: "bg-yellow-300" },
  { bg: "bg-green-200",  hoverBg: "hover:bg-green-300",  text: "text-green-900",  ring: "ring-green-400",  highlight: "bg-green-300" },
  { bg: "bg-pink-200",   hoverBg: "hover:bg-pink-300",   text: "text-pink-900",   ring: "ring-pink-400",   highlight: "bg-pink-300" },
  { bg: "bg-orange-200", hoverBg: "hover:bg-orange-300", text: "text-orange-900", ring: "ring-orange-400", highlight: "bg-orange-300" },
  { bg: "bg-purple-200", hoverBg: "hover:bg-purple-300", text: "text-purple-900", ring: "ring-purple-400", highlight: "bg-purple-300" },
];

// File upload configuration
export const FILE_UPLOAD_CONFIG = {
  ALLOWED_EXTENSIONS: [".pdf", ".txt"],
  ALLOWED_MIME_TYPES: ["application/pdf", "text/plain"],
};