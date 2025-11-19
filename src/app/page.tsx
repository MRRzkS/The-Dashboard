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
import { WireWidget } from "../components/widgets/WireWidget";
import { BooksWidget } from "../components/widgets/BooksWidget";
import { EnforcerWidget } from "../components/widgets/EnforcerWidget";

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
      <div className="col-span-12 flex flex-col md:flex-row justify-between items-start md:items-end mb-2 border-b border-[var(--mafia-muted)]/30 pb-4 gap-4 md:gap-0">
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
          <div className="col-span-12 md:col-span-7 flex flex-col gap-4 md:gap-6 h-auto pb-4 md:pb-10">

            {/* 1. Operations (The Main Work) */}
            {/* CHANGED: Increased min-h to 380px to fit the new Poker Cards comfortably */}
            <div className="flex-1 min-h-[380px] rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-4 md:p-6 backdrop-blur-sm flex flex-col">
              <div className="flex items-center justify-between mb-2 relative">
                <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-gray-300">
                  Operations
                </h2>
                {/* Adjusted divider margin to make room for button */}
                <div className="h-px flex-1 bg-[var(--mafia-muted)]/30 ml-6 mr-24"></div>
              </div>

              <OperationsWidget />
            </div>

            {/* 2. Secure Line */}
            <div className="h-64 rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-4 backdrop-blur-sm">
              <ConsigliereWidget />
            </div>

          </div>

          {/* Right Wing: LEDGER & CONTROLS */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-4 md:gap-6 h-auto pb-4 md:pb-10">

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

          {/* Strategy Row: THE BOOKS & THE ENFORCER */}
          <div className="col-span-12 flex flex-col md:flex-row gap-4 md:gap-6 h-[300px] pb-4 md:pb-10">
            {/* The Books (Analytics) - Takes more space */}
            <div className="flex-[2] rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-4 backdrop-blur-sm flex flex-col overflow-hidden">
              <BooksWidget />
            </div>

            {/* The Enforcer (Terminal) - Takes less space */}
            <div className="flex-1 rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 backdrop-blur-sm flex flex-col overflow-hidden">
              <EnforcerWidget />
            </div>
          </div>
        </>
      )}

      {/* ================= RELAX MODE LAYOUT ================= */}
      {mode === "relax" && (
        <>
          {/* Left Wing: INSPIRATION & BREATH - FINAL AESTHETIC BALANCE */}
          <div className="col-span-12 md:col-span-7 flex flex-col gap-4 md:gap-6 h-full pb-4 md:pb-10">

            {/* 1. The Consigliere (Quotes) - FIXED HEIGHT for visual weight */}
            <div className="h-64 rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-6 backdrop-blur-sm flex flex-col items-center justify-center">
              <QuoteWidget />
            </div>

            {/* 2. THE WIRE - Takes all remaining space for maximum impact */}
            <div className="flex-1 min-h-[256px] rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-6 backdrop-blur-sm h-full overflow-hidden">
              <WireWidget />
            </div>
          </div>

          {/* Right Wing: RECOVERY GRID (2x2) */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-4 md:gap-6 h-full pb-4 md:pb-10">

            {/* ROW 1: Timer + The Chain */}
            <div className="flex-1 min-h-[200px] grid grid-cols-2 gap-4">
              {/* The Fuse - ADDED h-full */}
              <div className="rounded-lg border border-[var(--mafia-accent)]/30 bg-[var(--mafia-surface)]/80 p-2 backdrop-blur-sm shadow-[0_0_15px_rgba(197,160,89,0.1)] flex flex-col h-full">
                <TimerWidget />
              </div>
              {/* The Chain (Habits) - ADDED h-full */}
              <div className="rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-2 backdrop-blur-sm flex flex-col h-full">
                <ChainWidget />
              </div>
            </div>

            {/* ROW 2: Audio + The Outlook */}
            <div className="flex-1 min-h-[200px] grid grid-cols-2 gap-4">
              {/* Audio Player - ADDED h-full */}
              <div className="rounded-lg border border-[var(--mafia-muted)]/20 bg-black/40 p-2 flex items-center justify-center overflow-hidden relative h-full">
                <VinylPlayer />
              </div>
              {/* The Outlook (Weather) - ADDED h-full */}
              <div className="rounded-lg border border-[var(--mafia-muted)]/20 bg-[var(--mafia-surface)]/50 p-2 backdrop-blur-sm flex flex-col h-full">
                <OutlookWidget />
              </div>
            </div>

          </div>
        </>
      )}

    </DashboardShell>
  );
}