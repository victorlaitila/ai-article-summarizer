import { useTranslation } from 'react-i18next';
import { Textarea } from "./ui/Input";

interface TextareaInputProps {
  text: string;
  setText: (text: string) => void;
}

export default function TextareaInput({ text, setText }: TextareaInputProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <p className="font-medium text-sm leading-none">{t("textAreaDescription")}</p>
      <Textarea
        id="freeText"
        value={text}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
        placeholder={t("textAreaPlaceholder")}
        className="min-h-[150px] w-full resize-y"
      />
    </div>
  );
}
