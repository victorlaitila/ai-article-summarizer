import { useEffect, useState } from "react";
import { useSpeechSynthesis } from "./hooks/useSpeechSynthesis";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/Card";
import { Toaster, toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./contexts/LanguageContext";
import { useContentHandler } from "./hooks/useContentHandler";
import AppHeader from "./components/AppHeader";
import SourceSelector from "./components/SourceSelector";
import UrlInput from "./components/UrlInput";
import TextareaInput from "./components/TextareaInput";
import FileUploader from "./components/FileUploader";
import ModeSelector from "./components/ModeSelector";
import GeneratorButton from "./components/GeneratorButton";
import SummaryButtonGroup from "./components/SummaryButtonGroup";
import SummaryPlaceholder from "./components/SummaryPlaceholder";
import FullArticle from "./components/FullArticle";
import Summary from "./components/Summary";
import type { SourceHandler, SourceType, SummaryMode } from "./types";
import { TOAST_DURATION, USE_MOCK_API } from "./constants";

export default function App() {
  const [sourceType, setSourceType] = useState<SourceType>("url");
  const [url, setUrl] = useState("");
  const [freeText, setFreeText] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [summaryMode, setSummaryMode] = useState<SummaryMode>("default");
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState("");
  const [article, setArticle] = useState("");
  const [showArticle, setShowArticle] = useState(false);

  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const { handleGenerate } = useContentHandler(summaryMode);
  const { stopTTS } = useSpeechSynthesis();

  const hasValidInput =
    (sourceType === "url" && !!url.trim()) ||
    (sourceType === "text" && !!freeText.trim()) ||
    (sourceType === "file" && !!file);

  const isGeneratorButtonDisabled = isGenerating || !hasValidInput || !summaryMode;

  const sourceHandlers: Record<SourceType, SourceHandler> = {
    url: {
      getInput: () => url,
      clearOtherSources: () => {
        setFreeText("");
        setFile(undefined);
      },
    },
    text: {
      getInput: () => freeText,
      clearOtherSources: () => {
        setUrl("");
        setFile(undefined);
      },
    },
    file: {
      getInput: () => file?.name || "",
      clearOtherSources: () => {
        setUrl("");
        setFreeText("");
      },
    },
  };

  /* Since the backend is hosted on a free tier service that sleeps after inactivity,
  a wake-up call is sent when the frontend loads. */
  useEffect(() => {
    changeLanguage(language, true); // No toast on initial load
    if (USE_MOCK_API) {
      return;
    }
    const wakeBackend = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
        console.log("Backend wake-up: ", response.status);
      } catch (err) {
        console.error("Backend wake-up failed", err);
      }
    };
    wakeBackend();
  }, []);

  const onGenerateClick = async () => {
    setIsGenerating(true);
    const inputValue = sourceHandlers[sourceType].getInput();
    const result = await handleGenerate(sourceType, inputValue, file);
    if (result?.summary && result.article_text) {
      // Stop any ongoing TTS when a new summary/article has been generated
      stopTTS();
      sourceHandlers[sourceType].clearOtherSources();
      setSummary(result.summary);
      setArticle(result.article_text);
      toast.success(t("successfulGeneration"));
    }
    setIsGenerating(false);
  };

  return (
    <div className="bg-linear-to-br from-background via-accent/20 to-background">
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            closeButton: "toast-close-button", 
            toast: "toast"
          },
          duration: TOAST_DURATION,
        }}
      />

      <AppHeader />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">

          {/* Input Section */}
          <Card className="shadow-xl border bg-linear-to-br from-card to-accent/10">
            <CardHeader>
              <p className="font-medium text-sm">{t("description")}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <SourceSelector sourceType={sourceType} setSourceType={setSourceType} />
              {sourceType === "url" && <UrlInput url={url} setUrl={setUrl} />}
              {sourceType === "text" && <TextareaInput text={freeText} setText={setFreeText} />}
              {sourceType === "file" && <FileUploader file={file} setFile={setFile} />}
              <ModeSelector summaryMode={summaryMode} setSummaryMode={setSummaryMode} />
              <GeneratorButton
                onClick={onGenerateClick}
                isGenerating={isGenerating}
                disabled={isGeneratorButtonDisabled}
              />
            </CardContent>
          </Card>

          {/* Output Section */}
          {summary ? (
            <Card className="shadow-xl bg-linear-to-br from-card to-purple-50/30">
              <CardHeader>
                <div className="flex justify-between max-[520px]:flex-col max-[520px]:gap-2.5">
                  <CardTitle className="text-2xl font-medium">{t("generatedSummary")}</CardTitle>
                  <SummaryButtonGroup summary={summary} />
                </div>
              </CardHeader>
              <Summary
                summary={summary}
                showArticle={showArticle}
                setShowArticle={setShowArticle}
              />
              {showArticle && <FullArticle article={article} />}
            </Card>
          ) : (
            <SummaryPlaceholder />
          )}
        </div>
      </main>
    </div>
  );
}
