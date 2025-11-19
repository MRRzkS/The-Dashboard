"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, Volume2 } from "lucide-react";
import { useDashboardStore } from "../../store/useStore";

export const VinylPlayer = () => {
  const { mode } = useDashboardStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(1);
  const [volume, setVolume] = useState(0.5); // Default volume: 50%
  const [isMounted, setIsMounted] = useState(false);

  const TOTAL_TRACKS = 2;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle Mode Change
  useEffect(() => {
    if (!isMounted || !audioRef.current) return;
    setPlaying(false);
    setTrackIndex(1);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.volume = volume; // Ensure volume persists
    }
  }, [mode, isMounted]);

  // Handle Play/Pause
  useEffect(() => {
    if (!isMounted || !audioRef.current) return;

    if (playing) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Playback prevented. Interaction needed.", error);
          setPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [playing, isMounted, trackIndex]);

  // Handle Volume Change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleTrackEnd = () => {
    const nextTrack = trackIndex === TOTAL_TRACKS ? 1 : trackIndex + 1;
    setTrackIndex(nextTrack);
  };

  const skipTrack = () => {
    const nextTrack = trackIndex === TOTAL_TRACKS ? 1 : trackIndex + 1;
    setTrackIndex(nextTrack);
    setPlaying(true);
  };

  if (!isMounted) return null;

  return (
    <div className="w-full h-full flex items-center justify-center gap-4 md:gap-6 px-2">
      
      <audio
        ref={audioRef}
        src={`/music/${mode}/track${trackIndex}.mp3`}
        onEnded={handleTrackEnd}
        preload="auto"
      />

      {/* The Record */}
      <div className="relative group shrink-0">
        <motion.div 
          animate={{ rotate: playing ? 30 : 0 }}
          className="absolute -top-4 right-1 w-1.5 h-12 bg-[var(--mafia-accent)] origin-top z-20 rounded-full shadow-lg"
          style={{ transformOrigin: "top center" }}
        />
        <motion.div
          animate={{ rotate: playing ? 360 : 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-black border-2 border-[var(--mafia-muted)] flex items-center justify-center shadow-2xl relative overflow-hidden"
        >
            <div className="absolute inset-1 rounded-full border border-[var(--mafia-surface)]/50" />
            <div className="absolute inset-4 rounded-full border border-[var(--mafia-surface)]/50" />
            <div className="absolute inset-8 rounded-full border border-[var(--mafia-surface)]/50" />
            <div className="w-8 h-8 rounded-full bg-[var(--mafia-danger)] border border-[var(--mafia-accent)]" />
        </motion.div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      </div>

      {/* The Controls */}
      <div className="flex flex-col justify-center min-w-0 gap-2">
        
        {/* Text Info */}
        <div>
          <div className="text-[10px] text-[var(--mafia-accent)] uppercase tracking-widest font-bold mb-1 truncate">
            Local Storage
          </div>
          <div className="text-xs md:text-sm text-white font-[family-name:var(--font-cinzel)] truncate">
            {mode === "focus" ? `Focus Reel #${trackIndex}` : `Lounge Reel #${trackIndex}`}
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setPlaying(!playing)}
            className="p-2 rounded-full border border-[var(--mafia-muted)] text-[var(--mafia-accent)] hover:bg-[var(--mafia-accent)] hover:text-black transition-colors"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button 
            onClick={skipTrack}
            className="p-2 rounded-full border border-[var(--mafia-muted)] text-[var(--mafia-muted)] hover:text-[var(--mafia-accent)] transition-colors"
          >
            <SkipForward size={14} />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2 mt-1">
          <Volume2 size={12} className="text-[var(--mafia-muted)]" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-[var(--mafia-muted)] rounded-lg appearance-none cursor-pointer accent-[var(--mafia-accent)]"
          />
        </div>

      </div>

    </div>
  );
};