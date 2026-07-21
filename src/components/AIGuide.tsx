import React, { useState, useEffect } from 'react';
import { Bot, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIGuideProps {
  message: string;
}

export default function AIGuide({ message }: AIGuideProps) {
  const [isOpen, setIsOpen] = useState(true);
  const safeMessage = message || "";
  const [displayedMessage, setDisplayedMessage] = useState(safeMessage);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setIsOpen(true);
    setIsTyping(true);
    setDisplayedMessage("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedMessage(safeMessage.slice(0, i));
      i++;
      if (i > safeMessage.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20); // Fast typing speed
    
    return () => clearInterval(interval);
  }, [safeMessage]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="ai-glow glass rounded-2xl p-4 max-w-sm mb-4 relative"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors">
              <X size={16} />
            </button>
            <div className="flex gap-2 items-center mb-2">
              <Sparkles size={16} className="text-violet-400" />
              <span className="text-violet-400 font-bold text-xs uppercase tracking-widest">CODI - IA Mentor</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed min-h-[3rem] italic">
              "{displayedMessage}{isTyping && <span className="animate-pulse">_</span>}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-105 transition-transform border border-violet-400/30 relative"
      >
        <div className="absolute inset-0 rounded-full border border-white/20 scale-90"></div>
        <Bot size={24} />
      </button>
    </div>
  );
}
