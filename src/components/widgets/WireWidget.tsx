"use client";

import React, { useState, useEffect } from "react";
import { Radio, ExternalLink, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES ---
interface Story {
    id: number;
    title: string;
    url: string;
    score: number;
    by: string;
    time: number;
}

export const WireWidget = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch Intel
    const fetchIntel = async () => {
        setLoading(true);
        setError(false);
        try {
            // 1. Get Top Stories IDs
            const topRes = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty");
            const topIds = await topRes.json();

            // 2. Get Details for top 10
            const top10Ids = topIds.slice(0, 10);
            const storyPromises = top10Ids.map((id: number) =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`).then(res => res.json())
            );

            const results = await Promise.all(storyPromises);
            setStories(results);
        } catch (err) {
            console.error("Comms Jammed:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIntel();

        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchIntel, 300000);
        return () => clearInterval(interval);
    }, []);

    // Auto-scroll ticker effect
    useEffect(() => {
        if (stories.length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % stories.length);
        }, 5000); // Rotate every 5 seconds

        return () => clearInterval(timer);
    }, [stories]);

    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[var(--mafia-accent)]">
                    <Radio size={16} className="animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest">The Wire</span>
                </div>

                <button
                    onClick={fetchIntel}
                    className="text-[var(--mafia-muted)] hover:text-white transition-colors"
                    disabled={loading}
                >
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Content Area - Terminal Style */}
            <div className="flex-1 bg-black/40 border border-[var(--mafia-muted)]/20 rounded p-3 font-mono text-xs relative overflow-hidden flex flex-col">

                {/* Scanlines Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />

                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-[var(--mafia-muted)] animate-pulse">
                        ESTABLISHING UPLINK...
                    </div>
                ) : error ? (
                    <div className="flex-1 flex items-center justify-center text-[var(--mafia-danger)]">
                        SIGNAL LOST. RETRYING...
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col gap-2 relative z-0">
                        {/* Current Headline (Large) */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col justify-center"
                            >
                                <span className="text-[10px] text-[var(--mafia-muted)] uppercase mb-1">
                                    Intercepted from {stories[currentIndex]?.by} • {new Date(stories[currentIndex]?.time * 1000).toLocaleTimeString()}
                                </span>
                                <a
                                    href={stories[currentIndex]?.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#4ade80] hover:underline hover:text-[#22c55e] transition-colors leading-tight text-sm line-clamp-3"
                                >
                                    {">"} {stories[currentIndex]?.title}
                                </a>
                                <div className="mt-2 flex items-center gap-2 text-[10px] text-[var(--mafia-muted)]">
                                    <span>▲ {stories[currentIndex]?.score}</span>
                                    <ExternalLink size={10} />
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Progress Bar */}
                        <div className="h-0.5 w-full bg-[var(--mafia-muted)]/20 mt-auto">
                            <motion.div
                                key={currentIndex + "progress"}
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 5, ease: "linear" }}
                                className="h-full bg-[var(--mafia-accent)]"
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
