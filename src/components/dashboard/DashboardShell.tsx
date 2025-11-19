"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDashboardStore } from "../../store/useStore";
import { cn } from "../../lib/utils";
import { PrivacyBlind } from "../../components/widgets/PrivacyBlind";

export const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useDashboardStore();
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  // The Tracker: Follow the mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div 
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative h-screen w-full overflow-hidden bg-[var(--mafia-base)] transition-colors duration-700"
    >
      
      {/* 1. The Base Atmosphere */}
      <motion.div
        animate={{
          opacity: mode === "focus" ? 0.4 : 0.8,
          scale: mode === "focus" ? 1 : 1.05,
        }}
        className={cn(
          "absolute inset-0 pointer-events-none z-0",
          mode === "relax" 
            ? "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[var(--mafia-accent)]/10 via-[var(--mafia-base)] to-black" 
            : "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800/20 via-[var(--mafia-base)] to-black"
        )}
      />

      {/* 2. The Spotlight (The New Strategy) */}
      <div
        className="pointer-events-none absolute -inset-px z-10 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(197, 160, 89, 0.07), transparent 40%)`,
        }}
      />

      {/* 3. Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* 4. Content Grid */}
      <main className="relative z-20 h-full w-full p-4 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-6">
         {children}
      </main>

    {/* 5. The Blind (Top Layer) */}
      <PrivacyBlind />
      
    </div>
  );
};