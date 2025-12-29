import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { Bookmark, BookmarkCheck, Copy, Download, Share2 } from 'lucide-react';
import { useSummaryActions } from '../hooks/useSummaryActions';
import { useState } from 'react';
import { USE_MOCK_API } from '../constants';

interface SummaryButtonGroupProps {
  summary: string;
  showSaveButton?: boolean;
}

export default function SummaryButtonGroup({summary, showSaveButton}: SummaryButtonGroupProps) {
  const { t } = useTranslation();
  const { handleCopy, handleDownload, handleShare, handleSave } = useSummaryActions(summary);
  
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const onSaveClick = async () => {
    setIsSaved(true);
    await handleSave();
  }

  return (
    <div className="flex gap-2">
      <Button
        title={t("copy")}
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
      >
        <Copy className="w-4 h-4" />
      </Button>
      <Button
        title={t("download")}
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
      >
        <Download className="w-4 h-4" />
      </Button>
      <Button
        title={t("share")}
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700"
      >
        <Share2 className="w-4 h-4" />
      </Button>
      {showSaveButton && (
        <Button
          title={t("save")}
          variant="outline" 
          size="sm" 
          onClick={onSaveClick}
          disabled={isSaved || USE_MOCK_API}
          className={isSaved ? "bg-amber-50 border-amber-200 text-amber-700" : "hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700"}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </Button>
      )}
    </div>
  )
}