"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Send } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface Command {
    id: string;
    type: "input" | "output" | "error" | "system";
    text: string;
}

export const EnforcerWidget = () => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<Command[]>([
        { id: "init", type: "system", text: "ENFORCER_OS v1.0.4 initialized..." },
        { id: "init2", type: "system", text: "Type 'help' for available commands." },
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (cmd: string) => {
        const args = cmd.trim().split(" ");
        const command = args[0].toLowerCase();

        // Add input to history
        const newHistory: Command[] = [...history, { id: Date.now().toString(), type: "input", text: `> ${cmd}` }];

        switch (command) {
            case "help":
                newHistory.push({
                    id: Date.now() + "r",
                    type: "output",
                    text: "Available commands:\n  help      - Show this list\n  clear     - Clear terminal\n  roll      - Roll dice (e.g. roll 1 100)\n  time      - Show local time\n  whoami    - Identify user\n  roulette  - Test your luck\n  ping      - Test network latency"
                });
                break;

            case "clear":
                setHistory([]);
                setInput("");
                return; // Early return to avoid setting history

            case "roll":
                const min = parseInt(args[1]) || 1;
                const max = parseInt(args[2]) || 100;
                const result = Math.floor(Math.random() * (max - min + 1)) + min;
                newHistory.push({ id: Date.now() + "r", type: "output", text: `Rolled: ${result}` });
                break;

            case "time":
                newHistory.push({ id: Date.now() + "r", type: "output", text: new Date().toLocaleString() });
                break;

            case "whoami":
                newHistory.push({ id: Date.now() + "r", type: "output", text: "Don Corelli (Admin)" });
                break;

            case "roulette":
                const chamber = Math.floor(Math.random() * 6);
                if (chamber === 0) {
                    newHistory.push({ id: Date.now() + "r", type: "error", text: "BANG! You're dead." });
                } else {
                    newHistory.push({ id: Date.now() + "r", type: "output", text: "*Click* ... You survive." });
                }
                break;

            case "ping":
                newHistory.push({ id: Date.now() + "r", type: "output", text: "Pinging server..." });
                // Simulate async response
                setTimeout(() => {
                    setHistory(prev => [...prev, {
                        id: Date.now() + "ping",
                        type: "output",
                        text: `Reply from 127.0.0.1: bytes=32 time=${Math.floor(Math.random() * 20)}ms TTL=128`
                    }]);
                }, 500);
                break;

            default:
                if (cmd.trim()) {
                    newHistory.push({ id: Date.now() + "r", type: "error", text: `Command not found: ${command}` });
                }
        }

        setHistory(newHistory);
        setInput("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        handleCommand(input);
    };

    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden bg-black border border-[var(--mafia-muted)]/30 rounded-lg font-mono text-xs md:text-sm" onClick={() => inputRef.current?.focus()}>

            {/* CRT Overlay Effects */}
            <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            <div className="absolute inset-0 pointer-events-none z-20 opacity-10 bg-gradient-to-b from-white/5 to-transparent" />

            {/* Header */}
            <div className="bg-[#111] p-2 border-b border-[var(--mafia-muted)]/30 flex justify-between items-center select-none">
                <div className="flex items-center gap-2 text-amber-500">
                    <Terminal size={14} />
                    <span className="font-bold tracking-widest uppercase text-[10px]">Enforcer_Term</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
            </div>

            {/* Terminal Output */}
            <div
                ref={scrollRef}
                className="flex-1 p-4 overflow-y-auto custom-scrollbar text-amber-500/90 flex flex-col gap-1"
            >
                {history.map((cmd) => (
                    <div key={cmd.id} className={cn(
                        "whitespace-pre-wrap break-words",
                        cmd.type === "input" && "text-white/80 mt-2",
                        cmd.type === "error" && "text-red-500",
                        cmd.type === "system" && "text-amber-500/50 italic"
                    )}>
                        {cmd.text}
                    </div>
                ))}
            </div>

            {/* Input Line */}
            <form onSubmit={handleSubmit} className="p-2 bg-[#0a0a0a] flex items-center gap-2 border-t border-[var(--mafia-muted)]/20 relative z-30">
                <span className="text-amber-500">{">"}</span>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-amber-500 placeholder:text-amber-500/30"
                    autoFocus
                    placeholder="Enter command..."
                />
                <button type="submit" className="text-amber-500 hover:text-white transition-colors">
                    <Send size={14} />
                </button>
            </form>

        </div>
    );
};
