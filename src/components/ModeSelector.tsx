import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select'
import type { SummaryMode } from '../types';

interface ModeSelectorProps {
  summaryMode: string;
  setSummaryMode: (mode: SummaryMode) => void;
}

export default function ModeSelector({summaryMode, setSummaryMode}: ModeSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <p className="font-medium text-sm leading-none">{t("summaryMode")}</p>
      <Select value={summaryMode} onValueChange={setSummaryMode}>
        <SelectTrigger id="summary-mode" className="h-12">
          <SelectValue placeholder={t("chooseSummaryStyle")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">{t("defaultSummary")}</SelectItem>
          <SelectItem value="bullets">{t("bulletPointsSummary")}</SelectItem>
          <SelectItem value="simple">{t("simplifiedSummary")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}