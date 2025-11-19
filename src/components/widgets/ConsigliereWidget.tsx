"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Eraser } from "lucide-react";
import { cn } from "../../lib/utils";

interface Message {
  role: "user" | "ai";
  text: string;
}

export const ConsigliereWidget = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput(""); // Clear input immediately
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.text) {
        setMessages((prev) => [...prev, { role: "ai", text: data.text }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "ai", text: "Connection failed. Check your API Key and Server Console." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-[var(--mafia-muted)]/30">
        <div className="text-[10px] uppercase tracking-widest text-[var(--mafia-muted)]">
          Secure Line
        </div>
        <button onClick={clearChat} className="text-[var(--mafia-muted)] hover:text-[var(--mafia-danger)] transition-colors">
          <Eraser size={14} />
        </button>
      </div>

      {/* Chat Window */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2 mb-2 custom-scrollbar min-h-0"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-[var(--mafia-muted)] opacity-50">
            <Bot size={20} className="mb-2" />
            <span className="text-[10px] uppercase tracking-widest">Awaiting Orders</span>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[85%] p-2 text-xs md:text-sm rounded-lg",
              m.role === "user" 
                ? "bg-[var(--mafia-accent)]/10 text-[var(--mafia-accent)] border border-[var(--mafia-accent)]/20 rounded-tr-none" 
                : "bg-[var(--mafia-surface)] text-gray-300 border border-[var(--mafia-muted)]/20 rounded-tl-none"
            )}>
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-xs text-[var(--mafia-muted)] animate-pulse pl-2">Deciphering...</div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="relative mt-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your directive..."
          className="w-full bg-[var(--mafia-surface)]/50 border border-[var(--mafia-muted)]/30 rounded p-2 pr-8 text-xs md:text-sm text-gray-200 focus:outline-none focus:border-[var(--mafia-accent)] transition-colors font-[family-name:var(--font-inter)] placeholder:text-[var(--mafia-muted)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--mafia-accent)] hover:text-white transition-colors disabled:opacity-50"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};