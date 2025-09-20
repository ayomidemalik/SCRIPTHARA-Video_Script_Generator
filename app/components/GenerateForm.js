'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const primaryDurations = [15, 30, 45, 60];
const moreDurations = ['1m 30s', '2m', '3m', '5m', '10m'];

export default function GenerateForm({ input, onInputChange, onGenerate, onGenerating, onGenerationEnd, isGenerating, placeholder }) {
  const [duration, setDuration] = useState(30);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(''); // State for custom validation error

  const handleDurationSelect = (newDuration) => {
    setDuration(newDuration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Custom validation check
    if (!input.trim()) {
      setError('Please provide a topic or idea for your script!');
      return; // Stop the submission if input is empty
    }
    setError(''); // Clear error if input is valid

    onGenerating();
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, duration }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.statusText}`);
      }

      const data = await response.json();
      onGenerate(data.script);
    } catch (error) {
      console.error('Error during script generation:', error);
    } finally {
      onGenerationEnd();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="script-form" noValidate> {/* noValidate disables default browser pop-ups */}
        <div className="duration-selector">
          <p className="duration-label">Script Duration</p>
          {primaryDurations.map((option) => (
            <button type="button" key={option} className={`duration-btn ${duration === option ? 'active' : ''}`} onClick={() => handleDurationSelect(option)}>{`${option}s`}</button>
          ))}
          <button type="button" className={`duration-btn more-btn ${showMore ? 'active' : ''}`} onClick={() => setShowMore(!showMore)}>{showMore ? 'Less' : 'More'}</button>
        </div>

        <AnimatePresence>
          {showMore && (
            <motion.div className="more-durations-wrapper" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
              {moreDurations.map((option) => (
                <button type="button" key={option} className={`duration-btn ${duration === option ? 'active' : ''}`} onClick={() => handleDurationSelect(option)}>{option.replace('m', ' min')}</button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="textarea-wrapper">
          <textarea
            value={input}
            onChange={(e) => {
              onInputChange(e.target.value);
              if (error) setError(''); // Clear error message as the user starts typing
            }}
            placeholder={placeholder || "Enter keywords, a link, or paste a blog post..."}
            rows={5}
            aria-invalid={!!error}
            aria-describedby="input-error"
          />
          <AnimatePresence>
            {error && (
              <motion.p
                id="input-error"
                className="validation-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <button type="submit" disabled={isGenerating} className="generate-button">
          {isGenerating ? 'Generating...' : 'Generate Script'}
        </button>
      </form>
      
      {/* Spinner container has been removed from here */}
    </>
  );
}