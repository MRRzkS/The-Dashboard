"use client";

import React, { useState, useEffect, useRef } from "react";
import { RefreshCw, Quote } from "lucide-react";

const MASTER_LIST = [
  { text: "Never hate your enemies. It affects your judgment.", author: "Michael Corleone" },
  { text: "The loudest one in the room is the weakest one in the room.", author: "Frank Lucas" },
  { text: "A man who doesn't spend time with his family can never be a real man.", author: "Don Corleone" },
  { text: "It is not the man who has too little, but the man who craves more, that is poor.", author: "Seneca" },
  { text: "He who fears death will never do anything worth of a man who is alive.", author: "Seneca" },
  { text: "The best revenge is not to be like your enemy.", author: "Marcus Aurelius" },
  { text: "Finance is a gun. Politics is knowing when to pull the trigger.", author: "Don Lucchesi" },
  { text: "I'm not upset that you lied to me, I'm upset that from now on I can't believe you.", author: "Nietzsche" },
  { text: "Appear weak when you are strong, and strong when you are weak.", author: "Sun Tzu" },
  { text: "The supreme art of war is to subdue the enemy without fighting.", author: "Sun Tzu" },
  { text: "Just when I thought I was out, they pull me back in.", author: "Michael Corleone" },
  { text: "Power wears out those who do not have it.", author: "Giulio Andreotti" },
  { text: "Revenge is a dish best served cold.", author: "Old Klingon Proverb" },
  { text: "Keep your friends close, but your enemies closer.", author: "Michael Corleone" },
  { text: "I'm gonna make him an offer he can't refuse.", author: "Don Corleone" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
  { text: "Silence is a true friend who never betrays.", author: "Confucius" },
  { text: "Real power can't be given. It must be taken.", author: "The Godfather" },
];

export const QuoteWidget = () => {
  const [currentQuote, setCurrentQuote] = useState(MASTER_LIST[0]);
  const [fade, setFade] = useState(false);
  
  // The Deck: Keeps track of unread quotes
  const deckRef = useRef<typeof MASTER_LIST>([]);

  useEffect(() => {
    // Initialize deck
    deckRef.current = [...MASTER_LIST].sort(() => Math.random() - 0.5);
    nextQuote();
  }, []);

  const nextQuote = () => {
    setFade(true);
    
    setTimeout(() => {
      // If deck is empty, reshuffle
      if (deckRef.current.length === 0) {
        deckRef.current = [...MASTER_LIST].sort(() => Math.random() - 0.5);
      }
      
      // Draw the top card
      const next = deckRef.current.pop();
      if (next) setCurrentQuote(next);
      
      setFade(false);
    }, 300);
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center text-center p-4 relative group">
      <div className="absolute top-2 left-2 text-[var(--mafia-accent)] opacity-20">
        <Quote size={40} />
      </div>
      
      <div className={`transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"}`}>
        <p className="text-lg md:text-xl font-[family-name:var(--font-cinzel)] text-gray-200 mb-4 leading-relaxed px-4">
          "{currentQuote.text}"
        </p>
        <p className="text-xs text-[var(--mafia-accent)] uppercase tracking-widest font-bold">
          — {currentQuote.author}
        </p>
      </div>

      <button 
        onClick={nextQuote}
        className="absolute bottom-2 right-2 p-2 text-[var(--mafia-muted)] hover:text-[var(--mafia-accent)] transition-colors opacity-0 group-hover:opacity-100"
      >
        <RefreshCw size={14} />
      </button>
    </div>
  );
};