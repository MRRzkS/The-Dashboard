"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Download } from "lucide-react";

export const NotesWidget = () => {
  const [note, setNote] = useState("");
  const [time, setTime] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Initialize: Load Note & Start Clock
  useEffect(() => {
    setIsMounted(true);
    setTime(new Date());

    // Load saved notes
    const saved = sessionStorage.getItem("mafia-notes");
    if (saved) setNote(saved);

    // Clock Interval (Tick every minute)
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. Auto-Save logic
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setNote(newValue);
    sessionStorage.setItem("mafia-notes", newValue);
  };

  // 3. The Drop (Export to .txt)
  const handleExport = () => {
    const blob = new Blob([note], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `consigliere-ledger-${format(new Date(), "yyyy-MM-dd")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-full w-full">
      
      {/* Header: Title + Drop Button + The Metronome */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
            <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-gray-300">
             The Ledger
            </h2>
            {/* The Drop Button */}
            <button 
                onClick={handleExport}
                title="Smuggle Data"
                className="text-[var(--mafia-muted)] hover:text-[var(--mafia-accent)] transition-colors"
            >
                <Download size={16} />
            </button>
        </div>

        <div className="text-right">
          <div className="text-[var(--mafia-accent)] font-mono text-sm font-bold tracking-widest">
            {time && format(time, "HH:mm")}
          </div>
          <div className="text-[var(--mafia-muted)] text-[10px] uppercase tracking-wider">
            {time && format(time, "MMM dd, yyyy")}
          </div>
        </div>
      </div>

      {/* The Divider */}
      <div className="h-px w-full bg-[var(--mafia-muted)]/30 mb-4"></div>

      {/* The Notepad */}
      <textarea
        value={note}
        onChange={handleChange}
        placeholder="Record your thoughts, Don Corelli..."
        className="flex-1 w-full bg-transparent resize-none focus:outline-none text-sm md:text-base leading-relaxed text-[var(--mafia-muted)] focus:text-gray-200 transition-colors placeholder:text-[var(--mafia-muted)]/30 custom-scrollbar font-[family-name:var(--font-inter)]"
        spellCheck={false}
      />
      
    </div>
  );
};