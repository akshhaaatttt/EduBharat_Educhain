'use client';

import { useState } from 'react';
import { useGemini } from '@/hooks/useGemini';
import ReactMarkdown from 'react-markdown';
import { Brain, Loader2 } from 'lucide-react';

interface LearningPathProps {
  careerPath: string;
}

export const LearningPath: React.FC<LearningPathProps> = ({ careerPath }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { generateLearningContent } = useGemini();

  const generatePath = async () => {
    setLoading(true);
    setError('');
    try {
      const prompt = `Create a detailed learning path for becoming a ${careerPath}. Include:
        1. Required skills and technologies
        2. Learning milestones
        3. Project suggestions
        4. Industry certifications
        5. Estimated timeline
        Format in markdown with clear sections.`;
      
      const response = await generateLearningContent(prompt);
      setContent(response);
    } catch (error) {
      console.error('Error generating learning path:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
      setError(errorMessage);
      
      // Always set fallback content regardless of error type
      setContent(`# ${careerPath} - Learning Path

## Overview
This is your personalized learning path to become a ${careerPath}. Follow this structured approach to achieve your career goals.

## Phase 1: Foundation (Weeks 1-4)
- Learn fundamental concepts
- Understand basic tools and technologies
- Complete introductory projects
- Join relevant communities

## Phase 2: Skill Development (Weeks 5-12)
- Dive deeper into core technologies
- Build portfolio projects
- Contribute to open source
- Network with professionals

## Phase 3: Advanced Topics (Weeks 13-20)
- Master advanced concepts
- Work on complex projects
- Prepare for interviews
- Consider specializations

## Phase 4: Career Preparation (Weeks 21-24)
- Polish your portfolio
- Practice technical interviews
- Apply to positions
- Continue learning

## Resources
- Online courses and bootcamps
- Books and documentation
- Practice platforms
- Professional networks

*Note: AI-generated content is temporarily unavailable. Please try again later for a personalized learning path.*`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Learning Path: {careerPath}</h2>
        <button
          onClick={generatePath}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Brain className="w-5 h-5" />
          )}
          Generate Path
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                API Limit Reached
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>The AI service is temporarily unavailable due to quota limits. Don't worry - we've provided you with a comprehensive fallback learning path below!</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    onClick={() => setError('')}
                    className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="prose max-w-none">
        {content ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <p className="text-gray-500 italic">
            Click "Generate Path" to create your personalized learning journey.
          </p>
        )}
      </div>
    </div>
  );
};