import { Trans, useTranslation } from "react-i18next";
import { CardContent, CardTitle } from "./ui/Card";
import TextToSpeechButton from "./TextToSpeechButton";
import { detectBCPLang } from "../utils/language";
import { useKeywords } from "../contexts/KeywordContext";
import { FormattedText } from "./FormattedText";
import { USE_MOCK_API } from "../constants";
import { normalizeKeywords } from "../utils/keywords";

interface SummaryProps {
  summary: string;
  summaryTitle?: string;
  summaryKeywords?: string[];
  showArticle?: boolean;
  setShowArticle?: (show: boolean) => void;
}

const keywordButtonStyles = [
  { bg: "bg-yellow-200", hoverBg: "hover:bg-yellow-300", text: "text-yellow-900", ring: "ring-yellow-400", ringRgb: "246,224,94" },
  { bg: "bg-green-200",  hoverBg: "hover:bg-green-300",  text: "text-green-900",  ring: "ring-green-400",  ringRgb: "104,211,145" },
  { bg: "bg-pink-200",   hoverBg: "hover:bg-pink-300",   text: "text-pink-900",   ring: "ring-pink-400",   ringRgb: "244,114,182" },
  { bg: "bg-orange-200", hoverBg: "hover:bg-orange-300", text: "text-orange-900", ring: "ring-orange-400", ringRgb: "251,146,60" },
  { bg: "bg-purple-200", hoverBg: "hover:bg-purple-300", text: "text-purple-900", ring: "ring-purple-400", ringRgb: "159,122,234" },
];

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
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-200/60">
            {keywordsToDisplay.map((word, index) => {
              const style = keywordButtonStyles[index % keywordButtonStyles.length];
              const isActive = selectedKeywords.includes(word);
              return (
                <span
                  key={word + index}
                  onClick={() => {
                    if (isSavedSummary) return;
                    toggleKeyword(word)
                  }}
                  className={[
                    "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                    !isSavedSummary && `cursor-pointer ${style.bg} ${style.text} ${style.hoverBg}`,
                    isSavedSummary && `${style.bg} ${style.text}`,
                    isActive && `ring-2 ring-offset-1 ${style.ring}`
                  ].join(" ")}
                >
                  {word}
                </span>
              );
            })}
          </div>
        )}
      </div>
      {!isSavedSummary && (
        <button
          onClick={() => setShowArticle(!showArticle)}
          className="text-blue-600 font-medium hover:underline mt-4 cursor-pointer"
        >
          {showArticle ? t("hideFullArticle") : t("showFullArticle")}
        </button>
      )}
    </CardContent>
  );
}
