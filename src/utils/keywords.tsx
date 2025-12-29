
import winkNLP from "wink-nlp";
import model from "wink-eng-lite-web-model";

const nlp = winkNLP(model);
const its = nlp.its;

// Stopword list
const stopWords = new Set([
  "i", "we", "you", "they", "he", "she", "it", "me", "us", "them",
  "this", "that", "these", "those", "a", "an", "the", "and", "or",
  "in", "on", "at", "for", "to", "of", "as", "by", "with", "is",
  "are", "was", "were", "been", "be", "have", "has", "had",
  "can", "could", "may", "might", "will", "would", "should",
  "from", "about", "into", "up", "down", "over", "after",
  "before", "between", "out", "so", "than", "very", "summary", 
  "read", "click", "page", "text", "show", "say", "says", "new", 
  "early", "major", "significant"
]);

/**
 * Extracts the most frequent keywords (nouns) from the given text.
 * 
 * @param text - The input text from which to extract keywords.
 * @param maxKeywords - The maximum number of keywords to return (default is 5).
 * @returns An array of the most frequent keywords found in the text, sorted by frequency.
 */
export function extractKeywords(text: string, maxKeywords = 5): string[] {
  const doc = nlp.readDoc(text);

  // Extract meaningful tokens
  const words = doc
    .tokens()
    .filter((t) =>
      t.out(its.type) === "word" &&
      !t.out(its.stopWordFlag) &&
      !stopWords.has(t.out(its.normal)) &&
      t.out(its.normal).length > 2 &&
      ["NOUN", "PROPN"].includes(t.out(its.pos))
    )
    .out(its.normal)
    .map((w) => w.replace(/["“”‘’]/g, ""));

  // Count frequencies
  const freqMap: Record<string, number> = {};
  words.forEach((word) => {
    freqMap[word] = (freqMap[word] || 0) + 1;
  });

  // Sort by frequency and return top N
  return Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, maxKeywords);
}
