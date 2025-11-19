"use client";

<link rel="icon" href="/favicon.ico" sizes="any" />
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { useDashboardStore } from "../store/useStore";
import { OperationsWidget } from "../components/widgets/OperationsWidget";
import { VinylPlayer } from "../components/widgets/VinylPlayer";
import { NotesWidget } from "../components/widgets/NotesWidget";
import { TimerWidget } from "../components/widgets/TimerWidget";
import { PulseWidget } from "../components/widgets/PulseWidget.tsx";
import { QuoteWidget } from "../components/widgets/QuoteWidget";
import { Incinerator } from "../components/widgets/Incinerator";
import { ConsigliereWidget } from "../components/widgets/ConsigliereWidget";
import { ChainWidget } from "../components/widgets/ChainWidget";
import { OutlookWidget } from "../components/widgets/OutlookWidget";

export default function Home() {
  const { mode } = useDashboardStore();

  // Determine time of day
  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <DashboardShell>
      {/* Header */}
      <div className="col-span-1 md:col-span-12 flex justify-between items-end mb-2 border-b border-[var(--mafia-muted)]/30 pb-4">
        <div>
          <h1 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl text-[var(--mafia-accent)] tracking-wider">
            THE DASHBOARD
          </h1>
          <p className="text-xs md:text-sm text-[var(--mafia-muted)] uppercase tracking-widest mt-1">
            Current Status: <span className="text-gray-300">{mode === "focus" ? "Deep Work" : "Decompression"}</span>
          </p>
        </div>

        {/* Right Side: Greeting & Incinerator */}
        <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] text-[var(--mafia-accent)] font-[family-name:var(--font-cinzel)] opacity-70">
                {greeting}, Don Corelli.
            </span>
            <Incinerator />
        </div>
      </div>

      {/* ================= FOCUS MODE LAYOUT ================= */}
      {mode === "focus" && (
        <>
          {/* Left Wing: OPERATIONS & SECURE LINE */}
          {/* Added 'pb-4 md:pb-10' to lift the bottom content */}
          <div className="col-span-12 md:col-span-7 flex flex-col gap-6 h-full pb-4 md:pb-10">
            
            {/* 1. Operations */}
            <div className="flex-1 min-h-[300px] rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-6 backdrop-blur-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-gray-300">
                  Operations
                </h2>
                <div className="h-px flex-1 bg-[var(--mafia-muted)]/30 ml-6"></div>
              </div>
              <OperationsWidget />
            </div>

            {/* 2. Secure Line */}
            <div className="h-64 rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-4 backdrop-blur-sm">
                <ConsigliereWidget />
            </div>

          </div>

          {/* Right Wing: LEDGER & CONTROLS */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-6 h-full pb-4 md:pb-10">
            
            {/* 1. The Ledger (Notes) */}
            <div className="flex-1 min-h-[200px] rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-6 backdrop-blur-sm flex flex-col">
              <NotesWidget />
            </div>

            {/* 2. Controls (Side-by-Side) - Height set to h-56 to keep Ledger compact */}
            <div className="h-56 grid grid-cols-2 gap-4">
                
                {/* The Fuse */}
                <div className="rounded-lg border border-[var(--mafia-accent)]/30 bg-[var(--mafia-surface)]/80 p-2 backdrop-blur-sm shadow-[0_0_15px_rgba(197,160,89,0.1)]">
                    <TimerWidget />
                </div>
                
                {/* Audio Player */}
                <div className="rounded-lg border border-[var(--mafia-muted)]/20 bg-black/40 p-2 flex items-center justify-center overflow-hidden relative">
                   <VinylPlayer />
                </div>
            </div>
            
          </div>
        </>
      )}

      {/* ================= RELAX MODE LAYOUT ================= */}
      {mode === "relax" && (
        <>
          {/* Left Wing: INSPIRATION & BREATH */}
          <div className="col-span-12 md:col-span-7 flex flex-col gap-6 h-full pb-4 md:pb-10">
             
             {/* 1. The Consigliere (Quotes) */}
             <div className="flex-1 min-h-[250px] rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-6 backdrop-blur-sm flex flex-col items-center justify-center">
                <QuoteWidget />
             </div>

             {/* 2. THE PULSE (Replaces Rolodex) */}
             <div className="h-64 rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-6 backdrop-blur-sm">
                <PulseWidget />
             </div>
          </div>

          {/* Right Wing: RECOVERY GRID (2x2) */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-6 h-full pb-4 md:pb-10">
            
            {/* ROW 1: Timer + The Chain */}
            {/* Changed from 'h-56' to 'flex-1' so it expands */}
            <div className="flex-1 grid grid-cols-2 gap-4 min-h-[200px]">
                {/* The Fuse */}
                <div className="rounded-lg border border-[var(--mafia-accent)]/30 bg-[var(--mafia-surface)]/80 p-2 backdrop-blur-sm shadow-[0_0_15px_rgba(197,160,89,0.1)] flex flex-col">
                    <TimerWidget />
                </div>
                {/* The Chain (Habits) */}
                <div className="rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-2 backdrop-blur-sm flex flex-col">
                    <ChainWidget />
                </div>
            </div>
            
            {/* ROW 2: Audio + The Outlook */}
            {/* Changed from 'h-56' to 'flex-1' so it expands */}
            <div className="flex-1 grid grid-cols-2 gap-4 min-h-[200px]">
                {/* Audio Player */}
                <div className="rounded-lg border border-[var(--mafia-muted)]/20 bg-black/40 p-2 flex items-center justify-center overflow-hidden relative">
                   <VinylPlayer />
                </div>
                 {/* The Outlook (Weather) */}
                 <div className="rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-2 backdrop-blur-sm flex flex-col">
                    <OutlookWidget />
                </div>
            </div>

          </div>
        </>
      )}

    </DashboardShell>
  );
}