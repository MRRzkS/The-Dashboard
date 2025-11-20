"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dices } from "lucide-react";

export const DiceWidget = () => {
    const [dice, setDice] = useState([1, 1]);
    const [rolling, setRolling] = useState(false);

    const rollDice = () => {
        if (rolling) return;
        setRolling(true);

        // Animate values rapidly
        const interval = setInterval(() => {
            setDice([
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1
            ]);
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            setDice([
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1
            ]);
            setRolling(false);
        }, 1000);
    };

    const renderDie = (value: number) => {
        return (
            <motion.div
                animate={rolling ? {
                    rotateX: Math.random() * 360,
                    rotateY: Math.random() * 360,
                    scale: [1, 1.1, 1]
                } : {
                    rotateX: 0,
                    rotateY: 0
                }}
                transition={{ duration: 0.2 }}
                className="w-12 h-12 bg-[#e5e5e5] rounded-xl shadow-[inset_0_0_10px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.3)] flex flex-wrap p-2 gap-1 border border-gray-300"
            >
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0.5">
                    {/* 1 */}
                    {value === 1 && <div className="col-start-2 row-start-2 bg-black rounded-full w-1.5 h-1.5 m-auto" />}

                    {/* 2 */}
                    {value === 2 && (
                        <>
                            <div className="col-start-1 row-start-1 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                            <div className="col-start-3 row-start-3 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                        </>
                    )}

                    {/* 3 */}
                    {value === 3 && (
                        <>
                            <div className="col-start-1 row-start-1 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                            <div className="col-start-2 row-start-2 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                            <div className="col-start-3 row-start-3 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                        </>
                    )}

                    {/* 4 */}
                    {value === 4 && (
                        <>
                            <div className="col-start-1 row-start-1 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                            <div className="col-start-3 row-start-1 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                            <div className="col-start-1 row-start-3 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                            <div className="col-start-3 row-start-3 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                        </>
                    )}

                    {/* 5 */}
                    {value === 5 && (
                        <>
                            <div className="col-start-1 row-start-1 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                            <div className="col-start-3 row-start-1 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                            <div className="col-start-2 row-start-2 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                            <div className="col-start-1 row-start-3 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                            <div className="col-start-3 row-start-3 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                        </>
                    )}

                    {/* 6 */}
                    {value === 6 && (
                        <>
                            <div className="col-start-1 row-start-1 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                            <div className="col-start-3 row-start-1 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                            <div className="col-start-1 row-start-2 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                            <div className="col-start-3 row-start-2 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                            <div className="col-start-1 row-start-3 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                            <div className="col-start-3 row-start-3 bg-black rounded-full w-1.5 h-1.5 m-auto" />
                        </>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-4 relative bg-gradient-to-br from-black/40 to-black/60">
            <div className="absolute top-2 left-2 flex items-center gap-2 text-[var(--mafia-muted)]">
                <Dices size={14} />
                <span className="text-[10px] uppercase tracking-widest">Snake Eyes</span>
            </div>

            <div className="flex gap-4 mb-6">
                {renderDie(dice[0])}
                {renderDie(dice[1])}
            </div>

            <div className="h-6 mb-2 text-[var(--mafia-accent)] font-mono font-bold">
                {rolling ? "..." : `TOTAL: ${dice[0] + dice[1]}`}
            </div>

            <button
                onClick={rollDice}
                disabled={rolling}
                className="px-6 py-2 rounded bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95 disabled:opacity-50"
            >
                Roll Dice
            </button>
        </div>
    );
};
