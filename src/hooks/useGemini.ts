'use client';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { apiConfig, isApiKeyConfigured, getErrorMessage } from '@/lib/config';
import { geminiRateLimiter } from '@/lib/rateLimiter';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export const useGemini = () => {
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const generateLearningContent = async (prompt: string, retries = apiConfig.gemini.maxRetries) => {
    // Check rate limiter first
    if (!geminiRateLimiter.canMakeRequest()) {
      const waitTime = geminiRateLimiter.getTimeUntilNextRequest();
      if (apiConfig.features.debugMode) {
        console.warn(`Rate limiter: Too many requests. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
      }
      // Return fallback content instead of waiting
      return getFallbackContent(prompt);
    }

    // Check if API is properly configured
    if (!isApiKeyConfigured()) {
      if (apiConfig.features.showFallbackContent) {
        return getFallbackContent(prompt);
      }
      throw new Error('API key is not configured. Please check your environment variables.');
    }

    // Check if AI features are enabled
    if (!apiConfig.features.aiEnabled) {
      return getFallbackContent(prompt);
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: apiConfig.gemini.model,
          generationConfig: apiConfig.gemini.generationConfig
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error: any) {
        if (apiConfig.features.debugMode) {
          console.error(`Attempt ${attempt} failed:`, error);
        }
        
        // Check if it's a quota/rate limit error
        const isQuotaError = error?.message?.includes('429') || 
                            error?.message?.includes('quota') || 
                            error?.message?.includes('rate limit') ||
                            error?.message?.includes('You exceeded your current quota');
        
        if (isQuotaError) {
          if (attempt === retries) {
            // If this is the last attempt, always return fallback content
            console.warn('API quota exceeded, returning fallback content');
            return getFallbackContent(prompt);
          }
          
          // Wait before retrying (exponential backoff)
          const waitTime = Math.min(
            apiConfig.gemini.retryDelay * Math.pow(2, attempt - 1), 
            apiConfig.gemini.maxRetryDelay
          );
          
          if (apiConfig.features.debugMode) {
            console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
          }
          
          await sleep(waitTime);
          continue;
        }
        
        // For other errors, return fallback content if enabled, otherwise throw
        if (apiConfig.features.showFallbackContent) {
          console.warn('API error occurred, returning fallback content:', getErrorMessage(error));
          return getFallbackContent(prompt);
        } else {
          throw new Error(getErrorMessage(error));
        }
      }
    }
    
    // This shouldn't be reached, but just in case
    return getFallbackContent(prompt);
  };

  const getFallbackContent = (prompt: string): string => {
    // Provide fallback content based on the prompt type
    if (prompt.toLowerCase().includes('learning path')) {
      return `# Learning Path

## Overview
This is a comprehensive learning path designed to help you achieve your career goals.

## Phase 1: Foundation (Weeks 1-4)
- Learn the fundamentals
- Practice basic concepts
- Build simple projects

## Phase 2: Intermediate (Weeks 5-8)
- Dive deeper into advanced topics
- Work on more complex projects
- Start building a portfolio

## Phase 3: Advanced (Weeks 9-12)
- Master advanced concepts
- Contribute to open source
- Prepare for interviews

## Resources
- Online courses and tutorials
- Documentation and guides
- Community forums and support

*Note: This is a fallback response. Please try again later for AI-generated content.*`;
    }
    
    return `# Learning Content

## Introduction
Welcome to your learning module! This content is designed to help you understand the key concepts.

## Key Topics
- Fundamental concepts
- Practical applications
- Best practices
- Real-world examples

## Practice Exercises
1. Start with basic exercises
2. Progress to intermediate challenges
3. Apply knowledge in projects

## Next Steps
- Continue practicing
- Explore advanced topics
- Join community discussions

*Note: This is a fallback response. Please try again later for AI-generated content.*`;
  };

  return { generateLearningContent };
};