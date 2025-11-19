"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EyeOff } from "lucide-react";

export const PrivacyBlind = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }} // Fast transition
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center cursor-default"
        >
          {/* The Icon */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--mafia-muted)] mb-4"
          >
            <EyeOff size={48} strokeWidth={1} />
          </motion.div>

          {/* The Message */}
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-[family-name:var(--font-cinzel)] text-2xl text-[var(--mafia-muted)] tracking-[0.2em]"
          >
            OPERATIONS SUSPENDED
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-[10px] uppercase tracking-widest text-[var(--mafia-muted)] animate-pulse"
          >
            Press Esc to Resume
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};