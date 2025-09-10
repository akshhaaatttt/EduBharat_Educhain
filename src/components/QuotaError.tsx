import React from 'react';
import { AlertTriangle, RefreshCw, Clock } from 'lucide-react';

interface QuotaErrorProps {
  onRetry?: () => void;
  retryDisabled?: boolean;
}

export const QuotaError: React.FC<QuotaErrorProps> = ({ onRetry, retryDisabled = false }) => {
  return (
    <div className="max-w-md mx-auto bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            API Quota Reached
          </h3>
          <p className="text-sm text-yellow-700 mb-4">
            We've temporarily hit our AI service limits. Don't worry - you'll still get comprehensive learning content through our high-quality fallback system!
          </p>
          
          <div className="bg-white bg-opacity-60 rounded-md p-3 mb-4">
            <div className="flex items-center space-x-2 text-xs text-yellow-600">
              <Clock className="h-4 w-4" />
              <span>Quotas typically reset every 24 hours</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {onRetry && (
              <button
                onClick={onRetry}
                disabled={retryDisabled}
                className="inline-flex items-center space-x-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </button>
            )}
            <span className="text-xs text-yellow-600">
              Fallback content is still fully functional
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotaError;
