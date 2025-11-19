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

  // ... inside Home() function ...

  return (
    <DashboardShell>
      {/* Header - Stacks on mobile, Row on Desktop */}
      <div className="col-span-1 md:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-end mb-2 border-b border-[var(--mafia-muted)]/30 pb-4 gap-4 md:gap-0">
        <div>
          <h1 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl text-[var(--mafia-accent)] tracking-wider">
            THE DASHBOARD
          </h1>
          <p className="text-xs md:text-sm text-[var(--mafia-muted)] uppercase tracking-widest mt-1">
            Current Status: <span className="text-gray-300">{mode === "focus" ? "Deep Work" : "Decompression"}</span>
          </p>
        </div>

        {/* Right Side: Greeting & Incinerator */}
        <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 w-full md:w-auto justify-between md:justify-end">
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
          {/* Mobile: Auto Height. Desktop: Full Height. */}
          <div className="col-span-1 md:col-span-7 flex flex-col gap-6 h-auto md:h-full pb-0 md:pb-10">
            
            {/* 1. Operations (The Main Work) */}
            {/* We keep min-h-[300px] which is perfect for the 240px high cards + padding */}
            <div className="flex-1 min-h-[320px] rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-4 md:p-6 backdrop-blur-sm flex flex-col">
              <div className="flex items-center justify-between mb-2 relative"> {/* Added relative for the button positioning */}
                <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-gray-300">
                  Operations
                </h2>
                <div className="h-px flex-1 bg-[var(--mafia-muted)]/30 ml-6 mr-24"></div> {/* Added mr-24 to make room for the Deal Button */}
              </div>
              
              {/* The Widget */}
              <OperationsWidget />
            </div>

            {/* 2. Secure Line */}
            <div className="h-64 rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-4 backdrop-blur-sm">
                <ConsigliereWidget />
            </div>

          </div>

          {/* Right Wing: LEDGER & CONTROLS */}
          <div className="col-span-1 md:col-span-5 flex flex-col gap-6 h-auto md:h-full pb-10 md:pb-10">
            
            {/* 1. The Ledger */}
            <div className="h-[300px] md:h-auto md:flex-1 rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-4 md:p-6 backdrop-blur-sm flex flex-col">
              <NotesWidget />
            </div>

            {/* 2. Controls - Stacks on mobile if needed, side-by-side on desktop */}
            <div className="h-auto md:h-56 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* The Fuse */}
                <div className="h-48 md:h-auto rounded-lg border border-[var(--mafia-accent)]/30 bg-[var(--mafia-surface)]/80 p-2 backdrop-blur-sm shadow-[0_0_15px_rgba(197,160,89,0.1)] flex flex-col">
                    <TimerWidget />
                </div>
                
                {/* Audio Player */}
                <div className="h-32 md:h-auto rounded-lg border border-[var(--mafia-muted)]/20 bg-black/40 p-2 flex items-center justify-center overflow-hidden relative">
                   <VinylPlayer />
                </div>
            </div>
            
          </div>
        </>
      )}

      {/* ================= RELAX MODE LAYOUT ================= */}
      {mode === "relax" && (
        <>
          {/* Left Wing */}
          <div className="col-span-1 md:col-span-7 flex flex-col gap-6 h-auto md:h-full pb-0 md:pb-10">
             
             {/* 1. Quotes */}
             <div className="h-[250px] md:h-auto md:flex-1 rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-6 backdrop-blur-sm flex flex-col items-center justify-center">
                <QuoteWidget />
             </div>

             {/* 2. The Pulse */}
             <div className="h-64 rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-6 backdrop-blur-sm">
                <PulseWidget />
             </div>
          </div>

          {/* Right Wing */}
          <div className="col-span-1 md:col-span-5 flex flex-col gap-6 h-auto md:h-full pb-10 md:pb-10">
            
            {/* ROW 1: Timer + The Chain */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[200px]">
                {/* The Fuse */}
                <div className="h-48 md:h-auto rounded-lg border border-[var(--mafia-accent)]/30 bg-[var(--mafia-surface)]/80 p-2 backdrop-blur-sm shadow-[0_0_15px_rgba(197,160,89,0.1)] flex flex-col">
                    <TimerWidget />
                </div>
                {/* The Chain */}
                <div className="h-48 md:h-auto rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-2 backdrop-blur-sm flex flex-col">
                    <ChainWidget />
                </div>
            </div>
            
            {/* ROW 2: Audio + Outlook */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[200px]">
                {/* Audio */}
                <div className="h-32 md:h-auto rounded-lg border border-[var(--mafia-muted)]/20 bg-black/40 p-2 flex items-center justify-center overflow-hidden relative">
                   <VinylPlayer />
                </div>
                 {/* Outlook */}
                 <div className="h-48 md:h-auto rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-2 backdrop-blur-sm flex flex-col">
                    <OutlookWidget />
                </div>
            </div>

          </div>
        </>
      )}

    </DashboardShell>
  );
}