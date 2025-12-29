import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import { Sparkles } from "lucide-react";

interface GeneratorButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export default function GeneratorButton({onClick, isGenerating, disabled}: GeneratorButtonProps) {
  const { t } = useTranslation();

  return (
    <div>
      <Button
        onClick={onClick}
        disabled={disabled}
        className="w-full h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary shadow-lg"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            {t("generating")}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            {t("generateSummary")}
          </>
        )}
      </Button>
    </div>
  );
}
