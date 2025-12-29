import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import { cn } from "./ui/utils";
import type { SourceType } from "../types";

interface SourceSelectorProps {
  sourceType: SourceType;
  setSourceType: (type: SourceType) => void;
}

export default function SourceSelector({ sourceType, setSourceType }: SourceSelectorProps) {
  const { t } = useTranslation();
  const options = [
    { type: "url", label: t("URL") },
    { type: "text", label: t("text") },
    { type: "file", label: t("file") },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {options.map(({ type, label }) => (
        <Button
          size="sm"
          key={type}
          variant={sourceType === type ? "default" : null}
          className={cn(
            "rounded-full border text-sm px-4 py-1",
            sourceType === type && "ring-1 ring-indigo-400"
          )}
          onClick={() => setSourceType(type as SourceType)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
