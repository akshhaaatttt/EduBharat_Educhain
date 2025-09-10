import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';

interface ApiStatusDisplayProps {
  isQuotaExceeded?: boolean;
  lastError?: string;
}

export const ApiStatusDisplay: React.FC<ApiStatusDisplayProps> = ({ 
  isQuotaExceeded = false, 
  lastError 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusInfo = () => {
    if (isQuotaExceeded || lastError?.includes('quota') || lastError?.includes('429')) {
      return {
        status: 'quota_exceeded',
        icon: <Clock className="w-5 h-5 text-yellow-500" />,
        title: 'API Quota Reached',
        message: 'Using high-quality fallback content',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800'
      };
    }

    return {
      status: 'active',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      title: 'AI Service Active',
      message: 'Generating personalized content',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-4 mb-6`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {statusInfo.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-medium ${statusInfo.textColor}`}>
              {statusInfo.title}
            </h4>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-500">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>
          <p className={`text-sm ${statusInfo.textColor} mt-1`}>
            {statusInfo.message}
          </p>
          
          {isQuotaExceeded && (
            <div className="mt-3 p-2 bg-white bg-opacity-60 rounded border">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-blue-700">
                  Fallback content provides the same comprehensive learning experience
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiStatusDisplay;
