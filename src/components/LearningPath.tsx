'use client';

import { useState } from 'react';
import { useGemini } from '@/hooks/useGemini';
import ReactMarkdown from 'react-markdown';
import { Brain, Loader2, Download, Maximize2, Minimize2 } from 'lucide-react';
import jsPDF from 'jspdf';

interface LearningPathProps {
  careerPath: string;
}

export const LearningPath: React.FC<LearningPathProps> = ({ careerPath }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
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

## Key Skills Required
- Programming languages (Python, JavaScript, etc.)
- Frameworks and libraries
- Database management
- Version control (Git)
- Problem-solving and algorithmic thinking

## Recommended Projects
1. Personal portfolio website
2. CRUD application with database
3. API development project
4. Open source contribution
5. Capstone project

## Industry Certifications
- Professional certification in your domain
- Cloud platform certifications (AWS, Azure, GCP)
- Relevant technology-specific certifications

## Learning Resources
- Online courses and bootcamps
- Books and documentation
- Practice platforms (LeetCode, HackerRank)
- Professional networks and communities
- YouTube tutorials and free content

## Timeline Breakdown
- **Month 1-2:** Foundation building
- **Month 3-4:** Core skill development
- **Month 5-6:** Advanced topics and projects
- **Month 7-8:** Portfolio building and job preparation

## Tips for Success
1. Practice consistently every day
2. Build real projects, not just tutorials
3. Join developer communities
4. Seek mentorship and feedback
5. Stay updated with industry trends
6. Network with professionals
7. Document your learning journey

*Note: AI-generated content is temporarily unavailable. Please try again later for a personalized learning path.*`);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!content) {
      alert('Please generate content first before downloading.');
      return;
    }

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Convert markdown to plain text for PDF
      const plainText = content
        .replace(/#{1,6}\s/g, '') // Remove markdown headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
        .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
        .replace(/`([^`]+)`/g, '$1') // Remove code formatting
        .replace(/```[\s\S]*?```/g, '[Code block]') // Replace code blocks
        .split('\n');

      // Add title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${careerPath} - Learning Path`, margin, yPosition);
      yPosition += 15;

      // Add generation date
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += 10;

      // Add separator line
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Process content
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');

      for (const line of plainText) {
        if (line.trim() === '') {
          yPosition += 5;
          continue;
        }

        // Check if we need a new page
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        // Handle section headers (lines that were originally headers)
        if (line.match(/^(Phase|Overview|Key Skills|Recommended|Industry|Learning|Timeline|Tips)/)) {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(12);
        } else if (line.startsWith('- ') || line.match(/^\d+\./)) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
        } else {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(11);
        }

        // Split long lines
        const splitText = pdf.splitTextToSize(line, maxWidth);
        
        for (const textLine of splitText) {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(textLine, margin, yPosition);
          yPosition += pdf.getLineHeight() + 2;
        }
      }

      // Add footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(
          `EduCareer AI - Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      pdf.save(`${careerPath.replace(/\s+/g, '_')}_Learning_Path.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto bg-black border border-green-500 rounded-xl shadow-lg transition-all duration-300 ${
      isExpanded ? 'fixed inset-4 z-50' : 'relative'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-green-500/30">
        <h2 className="text-xl font-bold text-green-400 font-mono">Learning Path: {careerPath}</h2>
        <div className="flex items-center gap-2">
          {content && (
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-green-600 text-black px-3 py-2 rounded-lg hover:bg-green-500 transition-colors text-sm font-mono font-bold"
              title="Download as PDF"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 bg-gray-700 text-green-400 px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={generatePath}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-mono"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Brain className="w-4 h-4" />
            )}
            Generate Path
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-300 font-mono">
                API Limit Reached
              </h3>
              <div className="mt-2 text-sm text-yellow-400">
                <p>The AI service is temporarily unavailable due to quota limits. Don't worry - we've provided you with a comprehensive fallback learning path below!</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    onClick={() => setError('')}
                    className="bg-yellow-900/50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-300 hover:bg-yellow-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600 font-mono"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Content Area with Limited Height and Scrolling */}
      <div className={`${isExpanded ? 'h-[calc(100vh-200px)]' : 'h-96'} overflow-y-auto p-6`}>
        <div className="prose prose-invert max-w-none">
          {content ? (
            <div className="text-green-400">
              <ReactMarkdown 
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-green-300 mb-4 font-mono" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold text-green-400 mb-3 mt-6 font-mono" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-bold text-green-400 mb-2 mt-4 font-mono" {...props} />,
                  p: ({node, ...props}) => <p className="text-green-300 mb-3 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="text-green-300 mb-4 ml-6 list-disc" {...props} />,
                  ol: ({node, ...props}) => <ol className="text-green-300 mb-4 ml-6 list-decimal" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  strong: ({node, ...props}) => <strong className="text-green-200 font-bold" {...props} />,
                  em: ({node, ...props}) => <em className="text-green-200 italic" {...props} />,
                  code: ({node, ...props}) => <code className="bg-green-900/30 text-green-200 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
                  pre: ({node, ...props}) => <pre className="bg-green-900/30 text-green-200 p-4 rounded-lg mb-4 overflow-x-auto font-mono text-sm" {...props} />,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-green-500/50 mx-auto mb-4" />
              <p className="text-green-500 italic font-mono">
                Click "Generate Path" to create your personalized learning journey.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      {content && (
        <div className="absolute bottom-4 right-4 text-xs text-green-500/70 font-mono">
          {isExpanded ? 'Expanded View' : 'Scroll for more'}
        </div>
      )}
    </div>
  );
};