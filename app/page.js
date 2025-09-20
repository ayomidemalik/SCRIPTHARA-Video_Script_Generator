'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GenerateForm from '@/components/GenerateForm';
import ScriptOutput from '@/components/ScriptOutput';
import ParticlesBackground from '@/components/ParticlesBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import dynamic from 'next/dynamic';

const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

// Array of placeholder examples
const placeholderExamples = [
  "Example: Write a YouTube script about the benefits of daily meditation, in a friendly and engaging tone.",
  "Example: Create a TikTok script explaining how AI tools save students time, with a funny twist.",
  "Example: Generate an Instagram Reel script promoting a new coffee shop in a casual storytelling style.",
  "Example: Write a professional LinkedIn video script introducing a fintech startup.",
  "Example: Draft an explainer video script on how blockchain works, using simple language for beginners.",
  "Example: Create an ad script for Instagram that highlights the launch of a new eco-friendly water bottle.",
  "Example: Write a motivational YouTube Shorts script encouraging viewers to start journaling daily."
];

export default function Home() {
  const [script, setScript] = useState('');
  const [input, setInput] = useState('');
  const [placeholder, setPlaceholder] = useState(''); // State for the randomized placeholder
  const [showConfetti, setShowConfetti] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const scriptOutputRef = useRef(null);

  // Set a random placeholder only once when the component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * placeholderExamples.length);
    setPlaceholder(placeholderExamples[randomIndex]);
  }, []);

  const handleGenerate = (generatedScript) => {
    setScript(generatedScript);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleGenerating = () => {
    setIsGenerating(true);
    setScript('');
  };
  
  const handleGenerationEnd = () => {
    setIsGenerating(false);
  };

  const handleGenerateNew = () => {
    setScript('');
    setInput('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (script && scriptOutputRef.current) {
      setTimeout(() => {
        scriptOutputRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [script]);

  const autoTypingText = "Generate engaging video scripts!";
  const sentenceVariants = { hidden: { opacity: 1 }, visible: { opacity: 1, transition: { delay: 0.5, staggerChildren: 0.05 } } };
  const letterVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  return (
    <main>
      <div className="main-container">
        {/* The spinner overlay is now here, controlled by isGenerating state */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              className="spinner-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingSpinner />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Changed class from fixed-author-info to author-info */}
        <div className="author-info">
          <p className="author-name">By Abdulmalik Memud</p>
          <a href="mailto:memudabdulmalik11@gmail.com" className="author-email">memudabdulmalik11@gmail.com</a>
        </div>
        
        {/* Changed class and removed "My" span */}
        <a href="https://github.com/ayomidemalik" target="_blank" rel="noopener noreferrer" className="header-link">View More Projects</a>
        
        <ParticlesBackground />
        {showConfetti && <Confetti recycle={false} numberOfPieces={500} colors={['#ec4899', '#a855f7', '#f59e0b']} />}

        <div className="page-content">
          <div className="container">
            <div className="row justify-center">
              <div className="col-12">
                <motion.div className="top-social-icons" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <a href="https://github.com/ayomidemalik" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></a>
                  <a href="https://linkedin.com/in/abdulmalik-memud-380550288/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg></a>
                  <a href="mailto:memudabdulmalik11@gmail.com" className="social-link" aria-label="Email"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg></a>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}><h1 className="brand-title">SCRIPTHARA</h1></motion.div>
                <motion.p className="subtitle-1" variants={sentenceVariants} initial="hidden" animate="visible">{autoTypingText.split("").map((char, index) => (<motion.span key={char + "-" + index} variants={letterVariants}>{char}</motion.span>))}</motion.p>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 2.5 }}><p className="subtitle-2">An AI-Powered tool</p></motion.div>
              </div>

              <div className="col-12 col-md-10">
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={{marginTop: '2rem'}}>
                    <div className="card">
                      <GenerateForm
                        input={input}
                        onInputChange={setInput}
                        onGenerate={handleGenerate}
                        onGenerating={handleGenerating}
                        onGenerationEnd={handleGenerationEnd}
                        isGenerating={isGenerating}
                        placeholder={placeholder}
                      />
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {script && (
                      <div ref={scriptOutputRef} className="script-output-wrapper">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                          <div className="card">
                            <ScriptOutput script={script} onGenerateNew={handleGenerateNew} />
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        <footer className="page-footer"><p>&copy; Copyright Scripthara 2025</p></footer>
      </div>
    </main>
  );
}