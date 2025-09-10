'use client';

import { useState, useEffect } from 'react';
import { WalletButton } from '@/components/WalletButton';
import { LearningPath } from '@/components/LearningPath';
import MentorList from '@/components/MentorList';
import { Brain, BookOpen, GraduationCap, Users, Search, Target, Award, BarChart2, MessageSquare } from 'lucide-react';
import { HeroVideoDialogDemo } from './../components/HeroVideoDialogDemo';
import LanguageTranslator from '@/components/language-translator';
import Preloader from '@/components/Preloader';
import Footer from '@/components/footer';
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
  const [isLoading, setIsLoading] = useState(true);

  const handleCustomPathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPath.trim()) {
      setSelectedPath(customPath.trim());
    }
  };

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* Header */}
      <header className="bg-black border-b border-green-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-green-400 neon-text" />
              <h1 className="text-2xl font-bold neon-text font-mono">EDUCAREER AI</h1>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-6">
                <a href="#about" className="text-green-400 hover:text-green-300 font-mono transition-all duration-300 hover:neon-text">ABOUT</a>
                <a href="#services" className="text-green-400 hover:text-green-300 font-mono transition-all duration-300 hover:neon-text">SERVICES</a>
                <a href="#features" className="text-green-400 hover:text-green-300 font-mono transition-all duration-300 hover:neon-text">FEATURES</a>
              </nav>
              <LanguageTranslator />
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-green-400 py-20 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-green-900/20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-6xl font-bold mb-4 neon-text font-mono">YOUR AI-POWERED</h2>
            <h3 className="text-4xl font-bold mb-6 text-green-300 font-mono">CAREER JOURNEY</h3>
            <p className="text-xl opacity-90 mb-8 font-mono">PERSONALIZED LEARNING PATHS TAILORED TO YOUR CAREER GOALS</p>
            
            {/* Career Path Generator Form */}
            <motion.form 
              onSubmit={handleCustomPathSubmit} 
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex gap-3 bg-black/50 border border-green-500 backdrop-blur-sm p-2 rounded-lg">
                <input
                  type="text"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  placeholder="ENTER YOUR DREAM CAREER PATH..."
                  className="flex-1 px-4 py-2 rounded-lg bg-black/70 text-green-400 placeholder-green-600 border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 font-mono"
                />
                <button
                  type="submit"
                  key={customPath}
                  onClick={() => setSelectedPath(customPath)}
                  className="px-6 py-2 bg-green-500 text-black rounded-lg font-mono font-bold hover:bg-green-400 transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-green-500/50"
                >
                  <Search className="w-4 h-4" />
                  UPDATE_PROMPT
                </button>
              </div>
            </motion.form>
          </motion.div>
          <motion.div 
            className="flex justify-center item-center mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="">
              <HeroVideoDialogDemo />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-black border-t border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold neon-text mb-6 font-mono">ABOUT EDUCAREER AI</h2>
            <p className="text-xl text-green-300 max-w-3xl mx-auto font-mono leading-relaxed">
              WE'RE REVOLUTIONIZING CAREER GUIDANCE WITH AI-POWERED INSIGHTS AND PERSONALIZED RECOMMENDATIONS.
              OUR PLATFORM HELPS YOU DISCOVER YOUR IDEAL CAREER PATH AND PROVIDES THE TOOLS YOU NEED TO SUCCEED.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold neon-text font-mono">OUR SERVICES</h2>
            <p className="text-xl text-green-300 mt-4 font-mono">
              DISCOVER HOW EDUCAREER AI CAN HELP YOU ACHIEVE YOUR EDUCATIONAL AND CAREER GOALS
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-black/70 p-8 rounded-lg border border-green-500 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-green-900/30 border border-green-500">
                  <div className="text-green-400">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white text-center mb-4">
                  {service.title}
                </h3>
                <p className="text-white text-cente">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold neon-text">Key Features</h2>
            <p className="text-xl text-green-300 mt-4">
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
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center neon-text font-mono">POPULAR CAREER PATHS</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {CAREER_PATHS.map((path) => (
              <button
                key={path}
                onClick={() => setSelectedPath(path)}
                className={`px-6 py-3 rounded-lg transition-all duration-300 border font-mono ${
                  selectedPath === path
                    ? 'bg-green-900/30 text-green-400 border-green-500 shadow-lg shadow-green-500/20'
                    : 'bg-black/50 text-green-300 border-green-700 hover:border-green-500 hover:text-green-400'
                }`}
              >
                {path}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path and Mentors */}
      <section className="py-20 bg-black">
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
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
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

      {/* Footer */}
      <Footer />
    </div>
  );
}

const services = [
  {
    title: "AI CAREER GUIDANCE",
    description: "GET PERSONALIZED CAREER RECOMMENDATIONS BASED ON YOUR SKILLS, INTERESTS, AND GOALS.",
    icon: <Brain className="w-8 h-8 text-green-400" />,
  },
  {
    title: "EDUCATIONAL RESOURCES",
    description: "ACCESS A COMPREHENSIVE LIBRARY OF LEARNING MATERIALS AND COURSES.",
    icon: <BookOpen className="w-8 h-8 text-green-400" />,
  },
  {
    title: "CAREER PATH PLANNING",
    description: "CREATE A DETAILED ROADMAP FOR YOUR PROFESSIONAL DEVELOPMENT.",
    icon: <Target className="w-8 h-8 text-green-400" />,
  },
  {
    title: "SKILL ASSESSMENT",
    description: "EVALUATE YOUR CURRENT SKILLS AND IDENTIFY AREAS FOR IMPROVEMENT.",
    icon: <Award className="w-8 h-8 text-green-400" />,
  },
  {
    title: "INDUSTRY INSIGHTS",
    description: "STAY UPDATED WITH THE LATEST TRENDS AND OPPORTUNITIES IN YOUR FIELD.",
    icon: <BarChart2 className="w-8 h-8 text-green-400" />,
  },
  {
    title: "PROFESSIONAL NETWORKING",
    description: "CONNECT WITH MENTORS AND PEERS IN YOUR INDUSTRY.",
    icon: <Users className="w-8 h-8 text-green-400" />,
  },
];

const features = [
  {
    title: "PERSONALIZED RECOMMENDATIONS",
    description: "OUR AI ANALYZES YOUR PROFILE TO PROVIDE TAILORED CAREER AND EDUCATIONAL SUGGESTIONS.",
    icon: <Brain className="w-6 h-6 text-green-400" />,
  },
  {
    title: "REAL-TIME UPDATES",
    description: "STAY INFORMED ABOUT NEW OPPORTUNITIES AND INDUSTRY DEVELOPMENTS.",
    icon: <MessageSquare className="w-6 h-6 text-green-400" />,
  },
  {
    title: "COMPREHENSIVE RESOURCES",
    description: "ACCESS A WIDE RANGE OF EDUCATIONAL MATERIALS AND CAREER GUIDANCE TOOLS.",
    icon: <BookOpen className="w-6 h-6 text-green-400" />,
  },
  {
    title: "CAREER PATH VISUALIZATION",
    description: "VISUALIZE YOUR POTENTIAL CAREER PATHS AND REQUIRED STEPS TO ACHIEVE YOUR GOALS.",
    icon: <Target className="w-6 h-6 text-green-400" />,
  },
];