import { useRef } from "react";
import { Button } from "./ui/Button";
import { useTranslation } from "react-i18next";
import { Upload, X } from "lucide-react";

interface FileUploaderProps {
  file: File | undefined;
  setFile: (file: File | undefined) => void;
}

export default function FileUploader({ file, setFile }: FileUploaderProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleReset = () => {
    setFile(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="font-medium text-sm text-gray-700">
        {t("fileUploadDescription")}
      </p>

      {/* Upload area */}
      {!file ? (
        <button
          type="button"
          onClick={handleClick}
          className="flex flex-col items-center justify-center w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors py-6 cursor-pointer"
        >
          <Upload className="w-4 h-4 text-gray-500 mb-1" />
          <span className="text-sm text-gray-600 font-medium">
            {t("uploadFile")}
          </span>
          <span className="text-xs text-gray-400">
            (.pdf, .txt)
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
        </button>
      ) : (
        <div className="flex items-center justify-between w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
          <span className="truncate max-w-[80%] text-gray-700">{file?.name}</span>
          {/* Remove uploaded file */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
