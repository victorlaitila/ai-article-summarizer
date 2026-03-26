import * as Sentry from "@sentry/react";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

function ErrorFallback() {
  const { t } = useTranslation();
  
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-accent/20 to-background">
      <div className="text-center p-8 max-w-md">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t("errorBoundaryTitle")}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t("errorBoundaryDescription")}
        </p>
        <button
          onClick={handleReload}
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          {t("errorBoundaryReload")}
        </button>
      </div>
    </div>
  );
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <Sentry.ErrorBoundary
      fallback={<ErrorFallback />}
      onError={(error, componentStack) => {
        console.error("Error caught by boundary:", error, componentStack);
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
