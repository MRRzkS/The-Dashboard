"use client";

import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Disc } from "lucide-react";
import { cn } from "../../lib/utils";

// Standard European Roulette Numbers (0-36)
// Order: 0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
const ROULETTE_NUMBERS = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const getNumberColor = (num: number) => {
    if (num === 0) return "#16a34a"; // Green
    // In roulette, odd/even doesn't perfectly map to red/black, it's specific.
    // Simplified for this widget: 
    // Red: 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(num) ? "#dc2626" : "#171717"; // Red or Black
};

export const WheelWidget = () => {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    const controls = useAnimation();

    const spinWheel = async () => {
        if (spinning) return;
        setSpinning(true);
        setResult(null);

        // Random rotation
        const segmentAngle = 360 / ROULETTE_NUMBERS.length;
        const extraSpins = 5 * 360;
        const randomOffset = Math.random() * 360;
        const totalRotation = extraSpins + randomOffset;

        await controls.start({
            rotate: -totalRotation, // Spin counter-clockwise like real roulette wheels often do (relative to ball)
            transition: { duration: 4, ease: "circOut" }
        });

        // Calculate result
        // Since we spin the wheel CCW, the number at the top (0 deg) is determined by:
        // (CurrentRotation % 360)
        const normalizedRotation = totalRotation % 360;
        // If we rotate -X degrees, the wheel moves CCW.
        // The pointer is at the top. 
        // The segment at the top is the one that was at +X degrees initially.
        const landingAngle = normalizedRotation;
        const segmentIndex = Math.floor(landingAngle / segmentAngle);
        // Wrap index if needed
        const safeIndex = segmentIndex % ROULETTE_NUMBERS.length;
        const landedNumber = ROULETTE_NUMBERS[safeIndex];

        setResult(landedNumber);
        setSpinning(false);

        controls.set({ rotate: -normalizedRotation });
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#0f172a]/30">
            <div className="absolute top-2 left-2 flex items-center gap-2 text-[var(--mafia-muted)]">
                <Disc size={14} />
                <span className="text-[10px] uppercase tracking-widest">Roulette</span>
            </div>

            {/* Wheel Container - Wood Finish */}
            <div className="relative mb-2 mt-2 p-1 rounded-full bg-gradient-to-br from-[#7c2d12] to-[#451a03] shadow-2xl border border-[#a16207]/30">
                {/* Pointer */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-[#fbbf24] drop-shadow-md" />
                </div>

                {/* The Wheel */}
                <motion.div
                    animate={controls}
                    className="w-28 h-28 rounded-full relative overflow-hidden border-[2px] border-[#fbbf24]/50 bg-[#1a1a1a]"
                    style={{ transformOrigin: "center" }}
                >
                    {/* Numbers Ring */}
                    {ROULETTE_NUMBERS.map((num, i) => (
                        <div
                            key={i}
                            className="absolute w-full h-full top-0 left-0 origin-[50%_50%]"
                            style={{
                                transform: `rotate(${i * (360 / ROULETTE_NUMBERS.length)}deg)`,
                            }}
                        >
                            {/* Segment Slice */}
                            <div
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-[8px] h-[50%] origin-bottom flex flex-col items-center pt-1"
                                style={{
                                    backgroundColor: getNumberColor(num),
                                    clipPath: "polygon(0 0, 100% 0, 50% 100%)", // Triangle slice
                                    width: `${(Math.PI * 112) / ROULETTE_NUMBERS.length}px` // Approx width at edge
                                }}
                            >
                                <span className="text-[4px] font-bold text-white transform -rotate-90 mt-0.5">
                                    {num}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Inner Wood/Brass Cone */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-[#92400e] to-[#451a03] flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] border border-[#b45309]">
                        {/* Brass Turret */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f59e0b] via-[#fcd34d] to-[#b45309] shadow-lg flex items-center justify-center border border-[#fffbeb]/20">
                            <div className="w-2 h-2 rounded-full bg-[#78350f] shadow-inner" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Result Display */}
            <div className="h-8 mb-1 flex items-center justify-center">
                {result !== null ? (
                    <div className="flex items-center gap-2">
                        <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white border border-white/20 shadow-inner"
                            style={{ backgroundColor: getNumberColor(result) }}
                        >
                            {result}
                        </div>
                        <span className="text-xs text-[var(--mafia-accent)] font-[family-name:var(--font-cinzel)]">
                            {result === 0 ? "ZERO" : getNumberColor(result) === "#dc2626" ? "RED" : "BLACK"}
                        </span>
                    </div>
                ) : (
                    <span className="text-[10px] text-[var(--mafia-muted)]">Place your bets...</span>
                )}
            </div>

            <button
                onClick={spinWheel}
                disabled={spinning}
                className="px-6 py-1.5 rounded bg-[var(--mafia-accent)]/10 border border-[var(--mafia-accent)]/30 text-[var(--mafia-accent)] text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--mafia-accent)]/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {spinning ? "Spinning..." : "Spin"}
            </button>
        </div>
    );
};
