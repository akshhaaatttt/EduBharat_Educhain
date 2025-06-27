import React, { useState } from 'react';
import { WalletButton } from './components/WalletButton';
import { LearningModule } from './components/LearningModule';
import { BookOpen, GraduationCap, Brain } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VideoCall from './app/VideoCall';

const TOPICS = [
  'Blockchain Fundamentals',
  'Smart Contracts',
  'Web3 Development',
  'Cryptocurrency Economics',
  'DeFi Protocols'
];

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
              <div className="flex space-x-7">
                <div>
                  <Link to="/" className="flex items-center py-4">
                    <span className="font-semibold text-gray-500 text-lg">EduCareer AI</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/video-call/:roomId" element={<VideoCall />} />
        </Routes>

        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Brain className="w-8 h-8 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">EduChain Learn</h1>
                </div>
                <WalletButton />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <BookOpen className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Personalized Learning</h3>
                <p className="text-gray-600">AI-powered content tailored to your learning style and pace.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <GraduationCap className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Blockchain Verified</h3>
                <p className="text-gray-600">Certificates and achievements stored on the blockchain.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Brain className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Smart Learning</h3>
                <p className="text-gray-600">Adaptive content generation using Google Gemini AI.</p>
              </div>
            </div>

            {/* Topic Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Select a Learning Topic</h2>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedTopic === topic
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Module */}
            <LearningModule topic={selectedTopic} />
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;