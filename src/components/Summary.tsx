import { Trans, useTranslation } from "react-i18next";
import { CardContent, CardTitle } from "./ui/Card";
import TextToSpeechButton from "./TextToSpeechButton";
import { detectBCPLang } from "../utils/language";
import { useKeywords } from "../contexts/KeywordContext";
import { FormattedText } from "./FormattedText";
import { USE_MOCK_API, KEYWORD_STYLES } from "../constants";
import { normalizeKeywords } from "../utils/keywords";

interface SummaryProps {
  summary: string;
  summaryTitle?: string;
  summaryKeywords?: string[];
  showArticle?: boolean;
  setShowArticle?: (show: boolean) => void;
}

export default function Summary({summary, summaryTitle, summaryKeywords, showArticle, setShowArticle}: SummaryProps) {
  const bcpLang = detectBCPLang(summary);
  const { generatedKeywords, selectedKeywords, toggleKeyword } = useKeywords();
  const { t } = useTranslation();
  const isSavedSummary = summaryKeywords || showArticle === undefined || setShowArticle === undefined;

  const keywordsToDisplay = normalizeKeywords(summaryKeywords && summaryKeywords.length > 0 ? summaryKeywords : (generatedKeywords ?? []));

  return (
    <CardContent className={isSavedSummary ? "pt-2" : ""}>
      <div className={`rounded-xl p-4 whitespace-pre-wrap ${isSavedSummary ? "bg-slate-50/80" : "bg-indigo-50"}`}>
        {/* Disclaimer text for when application is used with mock server */}
        {USE_MOCK_API && (
          <>
            <Trans
              i18nKey="mockSummary"
              components={{
                projectLink: (
                  <a
                    href="https://github.com/victorlaitila/ai-article-summarizer-backend/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  />
                ),
                demoLink: (
                  <a
                    href="https://www.youtube.com/watch?v=lZrHd0tOBXo/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  />
                ),
              }}
            />
            <div className="w-35/36 my-4 mx-auto h-px bg-gray-300" />
          </>
        )}
        <div>
          {/* Only show title inside Summary for non-saved summaries (main summarizer view) */}
          {summaryTitle && !isSavedSummary && (
            <CardTitle className="text-l font-semibold mb-4 mt-1">{summaryTitle}</CardTitle>
          )}
          <span>
            <FormattedText text={summary} />
            {!isSavedSummary && <>{" "}<TextToSpeechButton text={summary} lang={bcpLang} /></>}
          </span>
        </div>

        {/* Extracted keywords */}
        {keywordsToDisplay.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-200/60" role="group" aria-label="Keywords">
            {keywordsToDisplay.map((word, index) => {
              const style = KEYWORD_STYLES[index % KEYWORD_STYLES.length];
              const isActive = selectedKeywords.includes(word);
              
              if (isSavedSummary) {
                return (
                  <span
                    key={word + index}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
                  >
                    {word}
                  </span>
                );
              }
              
              return (
                <button
                  key={word + index}
                  type="button"
                  onClick={() => toggleKeyword(word)}
                  aria-pressed={isActive}
                  className={[
                    "px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer",
                    `${style.bg} ${style.text} ${style.hoverBg}`,
                    isActive && `ring-2 ring-offset-1 ${style.ring}`
                  ].join(" ")}
                >
                  {word}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {!isSavedSummary && (
        <button
          type="button"
          onClick={() => setShowArticle(!showArticle)}
          aria-expanded={showArticle}
          className="text-blue-600 font-medium hover:underline mt-4 cursor-pointer"
        >
          {showArticle ? t("hideFullArticle") : t("showFullArticle")}
        </button>
      )}
    </CardContent>
  );
}
