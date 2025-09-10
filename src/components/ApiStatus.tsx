import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, Zap } from 'lucide-react';
import { isApiKeyConfigured } from '@/lib/config';

interface ApiStatusProps {
  className?: string;
}

type ApiStatus = 'checking' | 'healthy' | 'quota-exceeded' | 'error' | 'not-configured';

export const ApiStatus: React.FC<ApiStatusProps> = ({ className }) => {
  const [status, setStatus] = useState<ApiStatus>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    setStatus('checking');
    
    try {
      if (!isApiKeyConfigured()) {
        setStatus('not-configured');
        return;
      }

      // Simple test request to check API status
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`);
      
      if (response.ok) {
        setStatus('healthy');
      } else if (response.status === 429) {
        setStatus('quota-exceeded');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkApiStatus();
    // Check status every 5 minutes
    const interval = setInterval(checkApiStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'checking':
        return {
          icon: <Zap className="h-4 w-4 animate-pulse" />,
          variant: 'default' as const,
          title: 'Checking API Status...',
          description: 'Verifying AI service availability'
        };
      
      case 'healthy':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          variant: 'default' as const,
          title: 'AI Services Online',
          description: 'All AI features are available and working normally'
        };
      
      case 'quota-exceeded':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          variant: 'warning' as const,
          title: 'Quota Limits Reached',
          description: 'AI content generation is temporarily limited. Fallback content will be provided.'
        };
      
      case 'error':
        return {
          icon: <XCircle className="h-4 w-4" />,
          variant: 'destructive' as const,
          title: 'API Error',
          description: 'There was an issue connecting to AI services. Please try again later.'
        };
      
      case 'not-configured':
        return {
          icon: <XCircle className="h-4 w-4" />,
          variant: 'destructive' as const,
          title: 'API Not Configured',
          description: 'Gemini API key is not configured. Please check your environment variables.'
        };
      
      default:
        return {
          icon: <Zap className="h-4 w-4" />,
          variant: 'default' as const,
          title: 'Unknown Status',
          description: 'Unable to determine API status'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Alert variant={statusInfo.variant} className={className}>
      {statusInfo.icon}
      <AlertDescription>
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{statusInfo.title}</div>
            <div className="text-sm">{statusInfo.description}</div>
            {lastChecked && (
              <div className="text-xs mt-1 opacity-75">
                Last checked: {lastChecked.toLocaleTimeString()}
              </div>
            )}
          </div>
          <button
            onClick={checkApiStatus}
            className="text-xs px-2 py-1 rounded bg-opacity-20 hover:bg-opacity-30 transition-colors"
            disabled={status === 'checking'}
          >
            Refresh
          </button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

// Compact version for header/navbar
export const ApiStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<ApiStatus>('checking');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        if (!isApiKeyConfigured()) {
          setStatus('not-configured');
          return;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`);
        
        if (response.ok) {
          setStatus('healthy');
        } else if (response.status === 429) {
          setStatus('quota-exceeded');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    checkStatus();
  }, []);

  const getIndicatorColor = () => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'quota-exceeded': return 'bg-yellow-500';
      case 'error':
      case 'not-configured': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'healthy': return 'AI Online';
      case 'quota-exceeded': return 'Quota Limited';
      case 'error': return 'AI Error';
      case 'not-configured': return 'Not Configured';
      default: return 'Checking...';
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${getIndicatorColor()}`}></div>
      <span className="text-gray-600">{getStatusText()}</span>
    </div>
  );
};
