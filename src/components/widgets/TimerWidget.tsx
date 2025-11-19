"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Lock, Unlock } from "lucide-react";
import { useDashboardStore } from "../../store/useStore";

export const TimerWidget = () => {
  const { mode, setMode } = useDashboardStore();
  
  // Configuration
  const FOCUS_TIME = 25 * 60;
  const RELAX_TIME = 5 * 60;

  // State
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isLocked, setIsLocked] = useState(true); // Start locked
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Reset timer when mode changes
  useEffect(() => {
    setIsActive(false);
    setIsLocked(true);
    setTimeLeft(mode === "focus" ? FOCUS_TIME : RELAX_TIME);
  }, [mode]);

  // 2. The Countdown
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsLocked(false); 
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const handleSwitch = () => {
    // If locked, do nothing (though the button is hidden anyway)
    if (isLocked) return; 
    const newMode = mode === "focus" ? "relax" : "focus";
    setMode(newMode);
  };

  // THE SKELETON KEY: Manual Override
  const forceUnlock = () => {
    setIsLocked(!isLocked);
    setIsActive(false); // Stop the timer if we force unlock
  };

  // Format Time
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  
  const totalTime = mode === "focus" ? FOCUS_TIME : RELAX_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="w-full h-full flex flex-col justify-between p-2">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-[10px] uppercase tracking-widest text-[var(--mafia-muted)]">
          {mode === "focus" ? "The Grind" : "The Break"}
        </div>
        
        {/* THE SKELETON KEY (Clickable Lock) */}
        <button
          onClick={forceUnlock}
          className={`transition-colors ${isLocked ? "text-[var(--mafia-muted)] hover:text-white cursor-pointer" : "text-[var(--mafia-accent)] animate-pulse cursor-pointer"}`}
          title="Click to Force Unlock"
        >
          {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
        </button>
      </div>

      {/* Display */}
      <div className="text-center py-2">
        <div className={`text-4xl md:text-5xl font-[family-name:var(--font-cinzel)] tracking-widest tabular-nums transition-colors ${isActive ? "text-white" : "text-[var(--mafia-muted)]"}`}>
          {formattedTime}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-[var(--mafia-muted)]/30 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-[var(--mafia-accent)] transition-all duration-1000 ease-linear"
          style={{ width: `${100 - progress}%` }} 
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 mt-auto">
        
        {/* Play/Pause (Only visible if locked) */}
        {isLocked && (
          <div className="flex justify-center gap-4">
            <button
              onClick={toggleTimer}
              className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-[var(--mafia-accent)] text-[var(--mafia-accent)] hover:bg-[var(--mafia-accent)] hover:text-black transition-all"
            >
              {isActive ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
          </div>
        )}

        {/* THE SWITCH BUTTON (Only visible if unlocked) */}
        {!isLocked && (
          <button
            onClick={handleSwitch}
            className="w-full py-3 bg-[var(--mafia-accent)] text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-white transition-colors animate-in fade-in zoom-in duration-300"
          >
            Enter {mode === "focus" ? "Lounge" : "Focus"}
          </button>
        )}
      </div>

    </div>
  );
};