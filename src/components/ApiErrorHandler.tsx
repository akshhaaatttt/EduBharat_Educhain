import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, Zap } from 'lucide-react';

interface ApiErrorHandlerProps {
  error: string;
  onRetry?: () => void;
  showFallback?: boolean;
}

export const ApiErrorHandler: React.FC<ApiErrorHandlerProps> = ({ 
  error, 
  onRetry, 
  showFallback = false 
}) => {
  const isQuotaError = error.toLowerCase().includes('quota') || 
                      error.toLowerCase().includes('429') || 
                      error.toLowerCase().includes('rate limit');

  if (isQuotaError) {
    return (
      <Alert variant="warning" className="mb-4">
        <Zap className="h-4 w-4" />
        <AlertTitle>API Quota Reached</AlertTitle>
        <AlertDescription>
          <div className="space-y-2">
            <p>
              We've reached the daily API quota limit for AI content generation. 
              {showFallback && " We've provided fallback content for now."}
            </p>
            <div className="text-sm">
              <p><strong>What you can do:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Try again in a few minutes</li>
                <li>Use the fallback content provided</li>
                <li>Come back later for AI-generated content</li>
              </ul>
            </div>
            {onRetry && (
              <button 
                onClick={onRetry}
                className="mt-2 px-3 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded text-sm transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <div className="space-y-2">
          <p>{error}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-sm transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export const QuotaInfoAlert: React.FC = () => {
  return (
    <Alert variant="info" className="mb-4">
      <Info className="h-4 w-4" />
      <AlertTitle>About AI Content Generation</AlertTitle>
      <AlertDescription>
        <div className="text-sm">
          <p>
            This app uses Google's Gemini AI to generate personalized learning content. 
            Due to free tier limitations, you may occasionally see fallback content when 
            the daily quota is exceeded.
          </p>
          <p className="mt-2">
            <strong>Tips for best experience:</strong>
          </p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Generate content during off-peak hours</li>
            <li>Use specific, focused prompts</li>
            <li>Save generated content for later reference</li>
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
};
