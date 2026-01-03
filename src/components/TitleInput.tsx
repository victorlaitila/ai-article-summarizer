import { useTranslation } from "react-i18next";
import { Input } from "./ui/Input";

interface TitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

export default function TitleInput({ title, setTitle }: TitleInputProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <p className="font-medium text-sm leading-none">{t("title")}</p>
      <Input
        id="title-input"
        type="text"
        placeholder={t("titlePlaceholder")}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="h-12"
      />
    </div>
  );
}
