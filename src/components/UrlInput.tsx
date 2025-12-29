import { useTranslation } from 'react-i18next';
import { Input } from './ui/Input';

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
}

export default function UrlInput({url, setUrl}: UrlInputProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <p className="font-medium text-sm leading-none">{t("articleUrl")}</p>
      <Input
        id="url"
        type="url"
        placeholder={t("urlPlaceholder")}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="h-12"
      />
    </div>
  )
}