import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [showMatrix, setShowMatrix] = useState(true);
  const [glitchText, setGlitchText] = useState('');

  const loadingTexts = [
    'INITIALIZING NEURAL NETWORKS...',
    'LOADING AI MODULES...',
    'CONNECTING TO BLOCKCHAIN...',
    'SYNCING CAREER DATABASE...',
    'COMPILING QUANTUM ALGORITHMS...',
    'CALIBRATING MENTORSHIP ENGINE...',
    'ESTABLISHING SECURE CONNECTIONS...',
    'OPTIMIZING LEARNING PATHWAYS...',
    'FINALIZING SYSTEM BOOT...',
    'WELCOME TO EDUCAREER AI'
  ];

  const techElements = ['AI', 'ML', 'WEB3', 'BLOCKCHAIN', 'NEURAL', 'QUANTUM', 'CYBER', 'MATRIX'];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 2 + 0.5; // Variable speed
        
        // Update text based on progress
        const textIndex = Math.floor((newProgress / 100) * loadingTexts.length);
        if (textIndex < loadingTexts.length) {
          setCurrentText(loadingTexts[textIndex]);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setCurrentText('SYSTEM READY - LAUNCHING...');
          setTimeout(() => {
            setShowMatrix(false);
            setTimeout(onComplete, 1500);
          }, 1500);
        }
        
        return Math.min(newProgress, 100);
      });
    }, 100);

    // Glitch effect for text
    const glitchInterval = setInterval(() => {
      const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
      const randomText = Array.from({ length: 20 }, () => 
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('');
      setGlitchText(randomText);
    }, 200);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  }, [onComplete]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Enhanced Matrix rain effect
  const generateMatrixRain = () => {
    if (typeof window === 'undefined' || !mounted) return []; // Handle SSR and mounting
    
    const columns = Math.floor(window.innerWidth / 20);
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
      drops.push(
        <motion.div
          key={i}
          className="matrix-rain absolute text-green-400 font-mono"
          style={{
            left: `${i * 20}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
          animate={{
            y: ['100vh', '-20px'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "linear"
          }}
        >
          {Math.random().toString(36).substring(2, 8)}
        </motion.div>
      );
    }
    return drops;
  };

  // DNA helix animation
  const generateDNAHelix = () => {
    const helixElements = [];
    for (let i = 0; i < 20; i++) {
      helixElements.push(
        <motion.div
          key={`dna-${i}`}
          className="absolute w-2 h-2 bg-green-400 rounded-full"
          style={{
            left: '50%',
            top: `${i * 5}%`,
          }}
          animate={{
            x: [Math.sin(i * 0.5) * 100, Math.sin(i * 0.5 + Math.PI) * 100],
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      );
    }
    return helixElements;
  };

  return (
    <AnimatePresence>
      {showMatrix && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="matrix-bg flex items-center justify-center relative overflow-hidden"
        >
          {/* Matrix Rain Background */}
          <div className="absolute inset-0 overflow-hidden">
            {generateMatrixRain()}
          </div>

          {/* DNA Helix Animation */}
          <div className="absolute inset-0 opacity-20">
            {generateDNAHelix()}
          </div>

          {/* Circuit Board Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 1000 1000">
              {[...Array(20)].map((_, i) => (
                <motion.path
                  key={`circuit-${i}`}
                  d={`M${Math.random() * 1000},${Math.random() * 1000} L${Math.random() * 1000},${Math.random() * 1000}`}
                  stroke="#39FF14"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                />
              ))}
            </svg>
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            {/* Logo/Brand with Hologram Effect */}
            <motion.div
              initial={{ scale: 0, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200, duration: 1.5 }}
              className="mb-8 relative"
            >
              <motion.div
                animate={{ 
                  rotateX: [0, 10, -10, 0],
                  rotateY: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-7xl font-bold neon-text mb-4 font-mono relative"
              >
                <span className="relative z-10">EDUCAREER</span>
                <motion.span
                  className="absolute inset-0 text-green-300 opacity-50"
                  animate={{ x: [0, 2, -2, 0], y: [0, -1, 1, 0] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  EDUCAREER
                </motion.span>
              </motion.div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl font-light text-green-400 font-mono"
              >
                ARTIFICIAL INTELLIGENCE
              </motion.div>
              
              {/* Glitch overlay */}
              <motion.div
                className="absolute inset-0 text-7xl font-bold font-mono text-red-500 opacity-20"
                animate={{ 
                  x: [0, -2, 2, 0],
                  opacity: [0, 0.3, 0, 0.1, 0]
                }}
                transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 2 }}
              >
                {glitchText.substring(0, 9)}
              </motion.div>
            </motion.div>

            {/* Advanced Circular Progress */}
            <motion.div
              initial={{ scale: 0, rotateZ: -180 }}
              animate={{ scale: 1, rotateZ: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 100, duration: 1.5 }}
              className="relative w-56 h-56 mx-auto mb-8"
            >
              {/* Multiple progress rings */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Outer ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="rgba(57, 255, 20, 0.1)"
                  strokeWidth="1"
                  fill="none"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#39FF14"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={282.7}
                  animate={{ 
                    strokeDashoffset: 282.7 - (282.7 * progress) / 100,
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    strokeDashoffset: { duration: 0.5 },
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                  }}
                  style={{
                    filter: 'drop-shadow(0 0 10px #39FF14)',
                  }}
                />
                
                {/* Middle ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="rgba(57, 255, 20, 0.2)"
                  strokeWidth="2"
                  fill="none"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#2ecc40"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={238.8}
                  animate={{ 
                    strokeDashoffset: 238.8 - (238.8 * (progress * 0.8)) / 100,
                    rotate: [360, 0]
                  }}
                  transition={{ 
                    strokeDashoffset: { duration: 0.5 },
                    rotate: { duration: 15, repeat: Infinity, ease: "linear" }
                  }}
                  style={{
                    filter: 'drop-shadow(0 0 5px #2ecc40)',
                  }}
                />
                
                {/* Inner ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  stroke="rgba(57, 255, 20, 0.3)"
                  strokeWidth="3"
                  fill="none"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="30"
                  stroke="#39FF14"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={188.5}
                  animate={{ 
                    strokeDashoffset: 188.5 - (188.5 * (progress * 0.6)) / 100,
                  }}
                  transition={{ duration: 0.5 }}
                  style={{
                    filter: 'drop-shadow(0 0 15px #39FF14)',
                  }}
                />
              </svg>
              
              {/* Center content with hologram effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-green-600 opacity-20 blur-xl absolute"
                />
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="relative z-10"
                >
                  <div className="text-4xl font-mono font-bold neon-text mb-2">
                    {Math.floor(progress)}%
                  </div>
                  <div className="text-xs font-mono text-green-300">
                    LOADING
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Loading Text with Typewriter Effect */}
            <motion.div
              key={currentText}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="text-lg font-mono text-green-400 mb-8 tracking-widest relative"
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {currentText}
              </motion.span>
              <motion.span
                className="text-green-300"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                |
              </motion.span>
            </motion.div>

            {/* Floating Tech Elements */}
            <div className="flex justify-center flex-wrap gap-4 mb-8">
              {techElements.map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, rotateY: -90, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    rotateY: 0, 
                    scale: 1,
                    y: [0, -10, 0],
                    rotateX: [0, 10, 0]
                  }}
                  transition={{ 
                    delay: 1.5 + index * 0.2,
                    y: { duration: 2, repeat: Infinity, delay: index * 0.3 },
                    rotateX: { duration: 4, repeat: Infinity, delay: index * 0.5 }
                  }}
                  className="text-sm font-mono text-green-300 border border-green-500 px-4 py-2 rounded-lg hover:scale-110 transition-transform cursor-pointer"
                  whileHover={{ 
                    scale: 1.2, 
                    boxShadow: "0 0 20px rgba(57, 255, 20, 0.5)",
                    rotateY: 15
                  }}
                >
                  {tech}
                </motion.div>
              ))}
            </div>

            {/* Enhanced Binary Code Stream */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="font-mono text-green-600 opacity-50 space-y-1"
            >
              <motion.div
                animate={{ x: [-1000, 1000] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="text-xs"
              >
                01001000 01100101 01101100 01101100 01101111 00100000 01000001 01001001
              </motion.div>
              <motion.div
                animate={{ x: [1000, -1000] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1 }}
                className="text-xs"
              >
                01010111 01100101 01101100 01100011 01101111 01101101 01100101
              </motion.div>
              <motion.div
                animate={{ x: [-800, 800] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
                className="text-xs"
              >
                01000101 01100100 01110101 01000011 01100001 01110010 01100101 01100101 01110010
              </motion.div>
            </motion.div>

            {/* Multi-layer Scanning Lines */}
            <motion.div
              animate={{ 
                scaleX: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
            />
            <motion.div
              animate={{ 
                scaleX: [0, 1, 0],
                opacity: [0, 0.5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute bottom-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent"
            />
          </div>

          {/* Enhanced Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-green-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  x: [-10, 10, -10],
                  opacity: [0.2, 1, 0.2],
                  scale: [0.5, 1.5, 0.5],
                  rotate: [0, 360, 0]
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="absolute bottom-8 left-8 text-xs font-mono text-green-500"
          >
            <div>SYSTEM STATUS: ONLINE</div>
            <div>AI CORES: {Math.floor(progress / 10)} / 10</div>
            <div>SECURITY: ENABLED</div>
          </motion.div>

          {/* Version Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
            className="absolute bottom-8 right-8 text-xs font-mono text-green-500"
          >
            <div>v2.0.24</div>
            <div>BUILD: {new Date().getFullYear()}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
