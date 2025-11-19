"use client";

import React from "react";
import { motion } from "framer-motion";

export const PulseWidget = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="text-[10px] uppercase tracking-widest text-[var(--mafia-muted)] absolute top-4 left-4">
        The Pulse
      </div>

      {/* The Breathing Circle */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1.5, 1], // Inhale, Hold, Exhale
          opacity: [0.3, 0.8, 0.8, 0.3],
        }}
        transition={{
          duration: 10, // 4s in, 2s hold, 4s out
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-24 h-24 rounded-full border-2 border-[var(--mafia-accent)] bg-[var(--mafia-accent)]/10 shadow-[0_0_30px_rgba(197,160,89,0.2)] flex items-center justify-center"
      >
        <motion.div 
           animate={{ opacity: [0, 1, 1, 0] }}
           transition={{ duration: 10, repeat: Infinity }}
           className="w-2 h-2 bg-[var(--mafia-accent)] rounded-full"
        />
      </motion.div>

      {/* Text Guide */}
      <motion.div
        className="mt-8 text-xs font-[family-name:var(--font-cinzel)] text-[var(--mafia-accent)]"
        animate={{ opacity: [0.5, 1, 1, 0.5] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        Inhale ... Hold ... Exhale
      </motion.div>
    </div>
  );
};