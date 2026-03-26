import { useRef, useState } from "react";
import { Button } from "./ui/Button";
import { useTranslation } from "react-i18next";
import { Upload, X } from "lucide-react";
import { FILE_UPLOAD_CONFIG } from "../constants";

interface FileUploaderProps {
  file: File | undefined;
  setFile: (file: File | undefined) => void;
  disabled?: boolean;
}

export default function FileUploader({ file, setFile, disabled }: FileUploaderProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragging to false if we're actually leaving the container
    const relatedTarget = e.relatedTarget as Node;
    if (!e.currentTarget.contains(relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      // Validate file type using centralized config
      const fileExtension = '.' + droppedFile.name.split('.').pop()?.toLowerCase();
      const isValidExtension = FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.includes(fileExtension);
      const isValidMime = FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(droppedFile.type);
      
      if (isValidExtension || isValidMime) {
        setFile(droppedFile);
      }
    }
  };

  return (
    <div
      className="flex flex-col gap-2"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ pointerEvents: disabled ? "none" : "auto" }}
    >
      <p className="font-medium text-sm text-gray-700">
        {t("fileUploadDescription")}
      </p>

      {/* Upload area */}
      {!file ? (
        <button
          type="button"
          disabled={disabled}
          onClick={handleClick}
          aria-label={t("uploadFile")}
          className={`flex flex-col items-center justify-center w-full rounded-lg border border-dashed transition-colors py-6 cursor-pointer ${
            isDragging 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <Upload aria-hidden="true" className={`w-4 h-4 mb-1 ${isDragging ? 'text-blue-500' : 'text-gray-500'}`} />
          <span className={`text-sm font-medium ${isDragging ? 'text-blue-600' : 'text-gray-600'}`}>
            {isDragging ? t("dropFileHere") : t("uploadFile")}
          </span>
          <span className="text-xs text-gray-400">
            ({FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(", ")})
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept={FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(",")}
            onChange={handleFileChange}
            className="hidden"
            aria-label={t("uploadFile")}
          />
        </button>
      ) : (
        <div className="flex items-center justify-between w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
          <span className="truncate max-w-[80%] text-gray-700">{file?.name}</span>
          {/* Remove uploaded file */}
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={handleReset}
            aria-label={t("removeFile")}
            className="text-red-500 hover:text-red-600 hover:bg-transparent p-1"
          >
            <X aria-hidden="true" className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
