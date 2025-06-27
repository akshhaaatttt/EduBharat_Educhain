'use client';

import { useState } from 'react';
import { WalletButton } from '@/components/WalletButton';
import { LearningPath } from '@/components/LearningPath';
import MentorList from '@/components/MentorList';
import { Brain, BookOpen, GraduationCap, Users, Search, Target, Award, BarChart2, MessageSquare } from 'lucide-react';
import { HeroVideoDialogDemo } from './../components/HeroVideoDialogDemo';
import LanguageTranslator from '@/components/language-translator';
import { motion } from 'framer-motion';
import EnhancedLearningDashboard from '@/components/EnhancedLearning/EnhancedLearningDashboard';

const CAREER_PATHS = [
  'AI/ML Engineer',
  'Web Developer',
  'Data Scientist',
  'Blockchain Developer',
  'DevOps Engineer'
];

export default function Home() {
  const [selectedPath, setSelectedPath] = useState(CAREER_PATHS[0]);
  const [customPath, setCustomPath] = useState('');

  const handleCustomPathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPath.trim()) {
      setSelectedPath(customPath.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">eduCareer AI</h1>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-6">
                <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
                <a href="#services" className="text-gray-600 hover:text-gray-900">Services</a>
                <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              </nav>
              <LanguageTranslator />
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Your AI-Powered Career Journey</h2>
            <p className="text-xl opacity-90 mb-8">Personalized learning paths tailored to your career goals</p>
            
            {/* Career Path Generator Form */}
            <form onSubmit={handleCustomPathSubmit} className="max-w-2xl mx-auto">
              <div className="flex gap-3 bg-white/10 backdrop-blur-sm p-2 rounded-lg">
                <input
                  type="text"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  placeholder="Enter your dream career path..."
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="submit"
                  key={customPath}
                  onClick={() => setSelectedPath(customPath)}
                  className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Update Prompt
                </button>
              </div>
            </form>
          </div>
          <div className="flex justify-center item-center mt-8">
            <HeroVideoDialogDemo />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About eduCareer AI</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing career guidance with AI-powered insights and personalized recommendations.
              Our platform helps you discover your ideal career path and provides the tools you need to succeed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="text-xl text-gray-600 mt-4">
              Discover how eduCareer AI can help you achieve your educational and career goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
            <p className="text-xl text-gray-600 mt-4">
              What makes eduCareer AI unique
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Path Selection */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Popular Career Paths</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {CAREER_PATHS.map((path) => (
              <button
                key={path}
                onClick={() => setSelectedPath(path)}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  selectedPath === path
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {path}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path and Mentors */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <LearningPath careerPath={selectedPath} />
            </div>
            <div>
              <MentorList careerPath={selectedPath} />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Learning Experience */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EnhancedLearningDashboard />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const services = [
  {
    title: "AI Career Guidance",
    description: "Get personalized career recommendations based on your skills, interests, and goals.",
    icon: <Brain className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Educational Resources",
    description: "Access a comprehensive library of learning materials and courses.",
    icon: <BookOpen className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Career Path Planning",
    description: "Create a detailed roadmap for your professional development.",
    icon: <Target className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Skill Assessment",
    description: "Evaluate your current skills and identify areas for improvement.",
    icon: <Award className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Industry Insights",
    description: "Stay updated with the latest trends and opportunities in your field.",
    icon: <BarChart2 className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Professional Networking",
    description: "Connect with mentors and peers in your industry.",
    icon: <Users className="w-8 h-8 text-blue-600" />,
  },
];

const features = [
  {
    title: "Personalized Recommendations",
    description: "Our AI analyzes your profile to provide tailored career and educational suggestions.",
    icon: <Brain className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Real-time Updates",
    description: "Stay informed about new opportunities and industry developments.",
    icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Comprehensive Resources",
    description: "Access a wide range of educational materials and career guidance tools.",
    icon: <BookOpen className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Career Path Visualization",
    description: "Visualize your potential career paths and required steps to achieve your goals.",
    icon: <Target className="w-6 h-6 text-blue-600" />,
  },
];