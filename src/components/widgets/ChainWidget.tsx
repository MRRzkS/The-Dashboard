"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";

const HABITS = ["Watch Movie", "Listen to Music", "Play Games"];

export const ChainWidget = () => {
  // Simple state (in reality, you'd save this to storage)
  const [completed, setCompleted] = useState<string[]>([]);

  const toggle = (habit: string) => {
    if (completed.includes(habit)) {
      setCompleted(completed.filter(h => h !== habit));
    } else {
      setCompleted([...completed, habit]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-2">
      <div className="text-[10px] uppercase tracking-widest text-[var(--mafia-muted)] mb-3">
        The Daily Rituals
      </div>
      <div className="flex flex-col gap-2 justify-center flex-1">
        {HABITS.map((habit) => {
          const isDone = completed.includes(habit);
          return (
            <button
              key={habit}
              onClick={() => toggle(habit)}
              className={`flex items-center justify-between p-2 rounded border transition-all ${
                isDone 
                ? "border-[var(--mafia-accent)] bg-[var(--mafia-accent)]/10" 
                : "border-[var(--mafia-muted)]/30 hover:border-[var(--mafia-muted)]"
              }`}
            >
              <span className={`text-xs ${isDone ? "text-[var(--mafia-accent)]" : "text-[var(--mafia-muted)]"}`}>
                {habit}
              </span>
              {isDone && <Check size={12} className="text-[var(--mafia-accent)]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};