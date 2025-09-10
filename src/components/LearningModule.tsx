import React, { useState } from 'react';
import { useGemini } from '../hooks/useGemini';
import ReactMarkdown from 'react-markdown';
import { Brain, Loader2 } from 'lucide-react';
import { ApiErrorHandler } from './ApiErrorHandler';

interface LearningModuleProps {
  topic: string;
}

export const LearningModule: React.FC<LearningModuleProps> = ({ topic }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { generateLearningContent } = useGemini();

  const generateContent = async () => {
    setLoading(true);
    setError('');
    try {
      const prompt = `Create a comprehensive learning module about ${topic}. Include:
        1. Introduction
        2. Key concepts
        3. Practical examples
        4. Quiz questions
        Format in markdown.`;
      
      const response = await generateLearningContent(prompt);
      setContent(response);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
      setError(errorMessage);
      
      // Set fallback content for quota errors
      if (errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('429')) {
        setContent(`# ${topic} - Learning Module

## Introduction
Welcome to the ${topic} learning module! This module is designed to provide you with a comprehensive understanding of the key concepts and practical applications.

## Key Concepts
- Fundamental principles
- Core technologies
- Best practices
- Industry standards

## Getting Started
1. Review the fundamentals
2. Practice with examples
3. Apply concepts in projects
4. Test your knowledge

## Resources
- Documentation and guides
- Online tutorials
- Community forums
- Practice exercises

*Note: AI-generated content is temporarily unavailable due to quota limits. This is fallback content.*`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{topic}</h2>
        <button
          onClick={generateContent}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Brain className="w-5 h-5" />
          )}
          Generate Content
        </button>
      </div>

      {error && (
        <ApiErrorHandler 
          error={error} 
          onRetry={generateContent}
          showFallback={!!content}
        />
      )}
      
      <div className="prose max-w-none">
        {content ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <p className="text-gray-500 italic">
            Click "Generate Content" to create an AI-powered learning module.
          </p>
        )}
      </div>
    </div>
  );
};