"use client";

import React, { useState } from "react";
import { Flame, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export const Incinerator = () => {
  const [armed, setArmed] = useState(false);

  const handleBurn = () => {
    if (!armed) {
      // Arm the device
      setArmed(true);
      // Auto-disarm after 3 seconds if not pressed
      setTimeout(() => setArmed(false), 3000);
    } else {
      // DETONATE
      burnItDown();
    }
  };

  const burnItDown = () => {
    // 1. Wipe the storage
    sessionStorage.removeItem("mafia-operations");
    sessionStorage.removeItem("mafia-notes");
    
    // 2. Visual Flash (We can reload the page to clear the React state instantly)
    // In a real app, we might use a global state reset, but reload is cleaner here.
    window.location.reload();
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleBurn}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`p-3 rounded-full border transition-all duration-300 flex items-center gap-2 ${
          armed
            ? "bg-[var(--mafia-danger)] border-[var(--mafia-danger)] text-white shadow-[0_0_15px_rgba(127,29,29,0.6)]"
            : "bg-transparent border-[var(--mafia-muted)]/30 text-[var(--mafia-muted)] hover:text-[var(--mafia-danger)] hover:border-[var(--mafia-danger)]"
        }`}
      >
        {armed ? <Flame size={18} className="animate-bounce" /> : <Flame size={18} />}
        
        {/* Warning Text (Only visible when armed) */}
        {armed && (
          <motion.span 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden"
          >
            CONFIRM BURN
          </motion.span>
        )}
      </motion.button>
    </div>
  );
};