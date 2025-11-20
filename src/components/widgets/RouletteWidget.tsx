"use client";

import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Crosshair, Skull } from "lucide-react";
import { cn } from "../../lib/utils";

export const RouletteWidget = () => {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<"idle" | "safe" | "dead">("idle");
    const controls = useAnimation();

    const spinAndPull = async () => {
        if (spinning) return;
        setSpinning(true);
        setResult("idle");

        // Spin animation
        await controls.start({
            rotate: 720 + Math.random() * 360,
            transition: { duration: 2, ease: "easeOut" }
        });

        // Reset rotation for next time (visually seamless if we mod 360 but for now just reset)
        controls.set({ rotate: 0 });

        // Calculate result (1/6 chance)
        const bullet = Math.floor(Math.random() * 6);

        setTimeout(() => {
            setSpinning(false);
            if (bullet === 0) {
                setResult("dead");
            } else {
                setResult("safe");
            }
        }, 500); // Slight delay for tension
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-black/20">
            <div className="absolute top-2 left-2 flex items-center gap-2 text-[var(--mafia-muted)]">
                <Crosshair size={14} />
                <span className="text-[10px] uppercase tracking-widest">Russian Roulette</span>
            </div>

            {/* Cylinder Visual */}
            <div className="relative mb-2 mt-4">
                <motion.div
                    animate={controls}
                    className="w-28 h-28 rounded-full border-4 border-[var(--mafia-muted)] relative flex items-center justify-center bg-[#1a1a1a]"
                >
                    {/* Chambers */}
                    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                        <div
                            key={i}
                            className="absolute w-6 h-6 rounded-full bg-black border border-[var(--mafia-muted)]/30"
                            style={{
                                transform: `rotate(${deg}deg) translate(32px) rotate(-${deg}deg)`
                            }}
                        />
                    ))}

                    {/* Center Hub */}
                    <div className="w-8 h-8 rounded-full bg-[var(--mafia-muted)]/20 border border-[var(--mafia-muted)]" />
                </motion.div>

                {/* Pointer/Hammer */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 text-red-500">
                    ▼
                </div>
            </div>

            {/* Status/Result */}
            <div className="h-8 mb-4 flex items-center justify-center">
                {result === "idle" && !spinning && (
                    <span className="text-[var(--mafia-muted)] text-xs">Are you feeling lucky?</span>
                )}
                {spinning && (
                    <span className="text-yellow-500 text-xs animate-pulse">Spinning...</span>
                )}
                {result === "safe" && (
                    <span className="text-green-500 font-bold text-sm animate-bounce">* CLICK *</span>
                )}
                {result === "dead" && (
                    <span className="text-red-600 font-bold text-lg flex items-center gap-2 animate-shake">
                        <Skull size={20} /> BANG!
                    </span>
                )}
            </div>

            {/* Trigger Button */}
            <button
                onClick={spinAndPull}
                disabled={spinning || result === "dead"}
                className={cn(
                    "px-6 py-2 rounded bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest hover:bg-red-900/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                    result === "dead" && "opacity-0 pointer-events-none"
                )}
            >
                Pull Trigger
            </button>

            {/* Reset if dead */}
            {result === "dead" && (
                <button
                    onClick={() => setResult("idle")}
                    className="absolute bottom-4 px-6 py-2 rounded bg-[var(--mafia-muted)]/20 border border-[var(--mafia-muted)]/30 text-[var(--mafia-muted)] text-xs font-bold uppercase tracking-widest hover:text-white transition-all"
                >
                    Revive
                </button>
            )}
        </div>
    );
};
