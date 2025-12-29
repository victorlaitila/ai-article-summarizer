import { useTranslation } from 'react-i18next';
import { Card, CardContent } from './ui/Card';
import { Sparkles } from 'lucide-react';

export default function SummaryPlaceholder() {
  const { t } = useTranslation();
  
  return (
    <Card className="shadow-xl border-1 bg-gradient-to-br from-card to-accent/10">
      <CardContent className="mb-8 flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mb-6 shadow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-lg font-medium mb-2">{t("readyToSummarize")}</h3>
        <div className="text-muted-foreground max-w-sm">
          {t("readyDescription")}
          <div className="w-35/36 my-2 mx-auto h-px bg-gray-300" />
          <div className="text-sm">{t("disclaimerText")}</div>
        </div>
      </CardContent>
    </Card>
  )
}