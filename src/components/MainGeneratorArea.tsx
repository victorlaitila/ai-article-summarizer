import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from ".././components/ui/Card";
import { useTranslation } from "react-i18next";
import SourceSelector from ".././components/SourceSelector";
import UrlInput from ".././components/UrlInput";
import TextareaInput from ".././components/TextareaInput";
import TitleInput from ".././components/TitleInput";
import FileUploader from ".././components/FileUploader";
import ModeSelector from ".././components/ModeSelector";
import GeneratorButton from ".././components/GeneratorButton";
import SummaryButtonGroup from ".././components/SummaryButtonGroup";
import SummaryPlaceholder from ".././components/SummaryPlaceholder";
import FullArticle from ".././components/FullArticle";
import Summary from ".././components/Summary";
import { type TempSummary, type SourceHandler, type SourceType, type SummaryMode } from "../types";
import { useContentHandler } from "../hooks/useContentHandler";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import { toast } from "sonner";

export default function MainGeneratorArea() {
  const [sourceType, setSourceType] = useState<SourceType>("url");
  const [url, setUrl] = useState("");
  const [freeText, setFreeText] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [summaryMode, setSummaryMode] = useState<SummaryMode>("default");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [summary, setSummary] = useState<TempSummary | null>(null);
  const [article, setArticle] = useState("");
  const [showArticle, setShowArticle] = useState<boolean>(false);

  const { t } = useTranslation();
  const { handleGenerate } = useContentHandler(summaryMode);
  const { stopTTS } = useSpeechSynthesis();

  const hasValidInput =
    (sourceType === "url" && !!url.trim()) ||
    (sourceType === "text" && !!freeText.trim() && !!title.trim()) ||
    (sourceType === "file" && !!file);

  const isGeneratorButtonDisabled = isGenerating || !hasValidInput || !summaryMode;

  const sourceHandlers: Record<SourceType, SourceHandler> = {
    url: {
      getInput: () => url,
      clearOtherSources: () => {
        setFreeText("");
        setTitle("");
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
        setTitle("");
      },
    },
  };

  const onGenerateClick = async () => {
    setIsGenerating(true);
    const inputValue = sourceHandlers[sourceType].getInput();
    const result = await handleGenerate(sourceType, inputValue, file);
    if (result?.summary && result.article_text) {
      // Stop any ongoing TTS when a new summary/article has been generated
      stopTTS();
      sourceHandlers[sourceType].clearOtherSources();
      const summaryTitle = sourceType === "text" ? title : result.title;
      setSummary({ 
        content: result.summary, 
        url: sourceType === "url" ? inputValue : undefined,
        title: summaryTitle
      });
      setArticle(result.article_text);
      toast.success(t("successfulGeneration"));
    }
    setIsGenerating(false);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-4">

        {/* Input Section */}
        <Card className="shadow-xl border bg-linear-to-br from-card to-accent/10">
          <CardHeader>
            <p className="font-medium text-sm">{t("description")}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <SourceSelector sourceType={sourceType} setSourceType={setSourceType} />
            {sourceType === "url" && <UrlInput url={url} setUrl={setUrl} />}
            {sourceType === "text" && (
              <>
                <TitleInput title={title} setTitle={setTitle} />
                <TextareaInput text={freeText} setText={setFreeText} />
              </>
            )}
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
                <SummaryButtonGroup summary={summary} showSaveButton={true} />
              </div>
            </CardHeader>
            <Summary
              summary={summary.content}
              summaryTitle={summary.title}
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
  );
}
