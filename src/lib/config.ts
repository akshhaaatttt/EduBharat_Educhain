// Configuration for EduCareer AI platform
export const apiConfig = {
  gemini: {
    maxRetries: 3,
    retryDelay: 1000,
    maxTokens: 2048,
    temperature: 0.7,
  },
  rateLimit: {
    requestsPerMinute: 10,
    burstLimit: 5,
  },
  features: {
    debugMode: process.env.NODE_ENV === 'development',
    enableAnalytics: true,
    enableOfflineMode: false,
  },
  ai: {
    fallbackEnabled: true,
    fallbackContent: {
      courses: "Explore programming fundamentals, web development, data science, and AI/ML.",
      mentorship: "Connect with experienced professionals in your field of interest.",
      skills: "Develop technical skills in coding, problem-solving, and project management.",
    }
  }
};

export const isApiKeyConfigured = (): boolean => {
  const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  return !!(geminiKey && geminiKey.length > 0 && geminiKey !== 'your-api-key-here');
};

export const getErrorMessage = (error: any): string => {
  if (error?.message) {
    // Handle specific Gemini API errors
    if (error.message.includes('API_KEY_INVALID')) {
      return 'Invalid API key. Please check your Gemini API configuration.';
    }
    if (error.message.includes('QUOTA_EXCEEDED')) {
      return 'API quota exceeded. Please try again later.';
    }
    if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
      return 'Rate limit exceeded. Please wait a moment before trying again.';
    }
    if (error.message.includes('SAFETY')) {
      return 'Content was blocked for safety reasons. Please rephrase your request.';
    }
    if (error.message.includes('BLOCKED')) {
      return 'Request was blocked. Please try a different approach.';
    }
    
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Environment validation
export const validateEnvironment = () => {
  const warnings: string[] = [];
  
  if (!isApiKeyConfigured()) {
    warnings.push('Gemini API key is not properly configured');
  }
  
  if (apiConfig.features.debugMode) {
    console.log('🔧 Debug mode enabled');
    console.log('📊 API Config:', apiConfig);
    
    if (warnings.length > 0) {
      console.warn('⚠️ Environment warnings:', warnings);
    }
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
};

// Export types for TypeScript
export type ApiConfig = typeof apiConfig;
export type ErrorHandler = typeof getErrorMessage;
