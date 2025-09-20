'use client';

import { useState } from 'react';

export default function ScriptOutput({ script, onGenerateNew }) {
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const copyToClipboard = async () => {
    if (isCopying) return;
    setIsCopying(true);
    try {
      const plainText = script.replace(/\*\*/g, ''); // Remove asterisks for clean copy
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsCopying(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setIsCopying(false);
    }
  };

  // Function to parse markdown-style bold text
  const parseBoldText = (text, key) => {
    const parts = text.split(/(\*\*.*?\*\*)/g); // Split by bold syntax
    return (
      <span key={key}>
        {parts.map((part, i) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={i}>{part.slice(2, -2)}</strong>
          ) : (
            part
          )
        )}
      </span>
    );
  };
  
  const formatScript = (text) => {
    const lines = text.split('\n');
    let isNextLineTitle = false;

    return lines.map((line, lineIndex) => {
      if (line.match(/^\(\d+-\d+ seconds\)/)) {
        isNextLineTitle = true;
        return <div key={lineIndex} className="time-marker">{line.trim()}</div>;
      }
      
      if (isNextLineTitle && line.trim() !== '') {
        isNextLineTitle = false;
        return <div key={lineIndex} className="section-title">{line.trim()}</div>;
      }
      
      if (line.trim() !== '') {
        return <p key={lineIndex} className="script-text">{parseBoldText(line, lineIndex)}</p>;
      }
      
      return null;
    });
  };

  return (
    <div className="output-container">
      <h2>Generated Script:</h2>
      
      <div className="output-content">
        {formatScript(script)}
      </div>
      
      <div className="button-group-wrapper">
        <button onClick={copyToClipboard} disabled={isCopying} className="copy-button">
          {copied ? 'Copied!' : 'Copy Script'}
        </button>
        <button onClick={onGenerateNew} className="generate-new-button">
          Generate New Script
        </button>
      </div>
    </div>
  );
}