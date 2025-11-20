"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Club, Diamond, Heart, Spade, Trophy } from "lucide-react";
import { cn } from "../../lib/utils";

type Suit = "hearts" | "diamonds" | "clubs" | "spades";
type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

interface Card {
    suit: Suit;
    rank: Rank;
    value: number;
}

const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
const RANKS: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

const getCardValue = (rank: Rank): number => {
    return RANKS.indexOf(rank) + 2;
};

const generateDeck = (): Card[] => {
    const deck: Card[] = [];
    SUITS.forEach(suit => {
        RANKS.forEach(rank => {
            deck.push({ suit, rank, value: getCardValue(rank) });
        });
    });
    return deck.sort(() => Math.random() - 0.5);
};

const CardView = ({ card, hidden = false }: { card?: Card, hidden?: boolean }) => {
    if (hidden || !card) {
        return (
            <div className="w-10 h-14 bg-blue-900 rounded border border-blue-700 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                <div className="w-6 h-10 border border-blue-500/30 rounded-sm" />
            </div>
        );
    }

    const isRed = card.suit === "hearts" || card.suit === "diamonds";
    const Icon = card.suit === "hearts" ? Heart : card.suit === "diamonds" ? Diamond : card.suit === "clubs" ? Club : Spade;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-10 h-14 bg-white rounded border border-gray-300 flex flex-col items-center justify-center relative shadow-md"
        >
            <span className={cn("text-xs font-bold absolute top-0.5 left-1", isRed ? "text-red-600" : "text-black")}>
                {card.rank}
            </span>
            <Icon size={12} className={isRed ? "text-red-600" : "text-black"} />
        </motion.div>
    );
};

export const PokerWidget = () => {
    const [gameState, setGameState] = useState<"idle" | "dealing" | "showdown">("idle");
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [houseHand, setHouseHand] = useState<Card[]>([]);
    const [community, setCommunity] = useState<Card[]>([]);
    const [winner, setWinner] = useState<"player" | "house" | "push" | null>(null);

    const deal = () => {
        setGameState("dealing");
        setWinner(null);
        const deck = generateDeck();

        const pHand = [deck.pop()!, deck.pop()!];
        const hHand = [deck.pop()!, deck.pop()!];
        const comm = [deck.pop()!, deck.pop()!, deck.pop()!, deck.pop()!, deck.pop()!];

        setPlayerHand(pHand);
        setHouseHand(hHand);
        setCommunity(comm);

        setTimeout(() => {
            setGameState("showdown");
            determineWinner(pHand, hHand, comm);
        }, 1000);
    };

    const determineWinner = (pHand: Card[], hHand: Card[], comm: Card[]) => {
        // Very simplified logic: Just sum of top 2 cards + random factor for "luck"
        // In a real app, we'd use a poker evaluator library.
        // For this widget, let's just pick a random winner to simulate the thrill without the 1000 lines of logic.
        // Or slightly better: High Card check.

        const pMax = Math.max(...pHand.map(c => c.value));
        const hMax = Math.max(...hHand.map(c => c.value));

        if (pMax > hMax) setWinner("player");
        else if (hMax > pMax) setWinner("house");
        else setWinner("push");
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-between p-4 relative bg-green-900/20">
            <div className="absolute top-2 left-2 flex items-center gap-2 text-[var(--mafia-muted)]">
                <Trophy size={14} />
                <span className="text-[10px] uppercase tracking-widest">Hold'em Showdown</span>
            </div>

            {/* House Hand */}
            <div className="flex flex-col items-center gap-1 mt-8">
                <span className="text-[10px] text-[var(--mafia-muted)] uppercase">The House</span>
                <div className="flex gap-2">
                    <CardView card={houseHand[0]} hidden={gameState !== "showdown"} />
                    <CardView card={houseHand[1]} hidden={gameState !== "showdown"} />
                </div>
            </div>

            {/* Community Cards */}
            <div className="flex gap-1 my-1">
                {gameState === "idle" ? (
                    Array(5).fill(null).map((_, i) => <div key={i} className="w-8 h-12 border border-white/10 rounded bg-white/5" />)
                ) : (
                    community.map((c, i) => <CardView key={i} card={c} />)
                )}
            </div>

            {/* Player Hand & Controls Container */}
            <div className="flex flex-col items-center gap-1 mb-0 w-full relative h-20 justify-end">
                {/* Player Hand */}
                <div className="flex flex-col items-center gap-1 z-0">
                    <div className="flex gap-2">
                        <CardView card={playerHand[0]} />
                        <CardView card={playerHand[1]} />
                    </div>
                    <span className="text-[10px] text-[var(--mafia-accent)] uppercase font-bold">You</span>
                </div>

                {/* Deal Button - Positioned over cards if idle, or below if active */}
                {gameState === "idle" && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60 backdrop-blur-[2px] rounded-lg">
                        <button
                            onClick={deal}
                            className="px-4 py-1.5 rounded bg-[var(--mafia-accent)] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                        >
                            Deal Hand
                        </button>
                    </div>
                )}
            </div>

            {/* Result Overlay - Subtle Banner */}
            {gameState === "showdown" && winner && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
                >
                    <div className="bg-black/90 border-y border-[var(--mafia-accent)] w-full py-3 flex flex-col items-center justify-center backdrop-blur-md shadow-2xl">
                        <h3 className={cn("text-xl font-bold font-[family-name:var(--font-cinzel)] tracking-widest mb-2 drop-shadow-md",
                            winner === "player" ? "text-[var(--mafia-accent)]" : winner === "house" ? "text-red-500" : "text-gray-400")}>
                            {winner === "player" ? "YOU WIN" : winner === "house" ? "HOUSE WINS" : "PUSH"}
                        </h3>
                        <button
                            onClick={deal}
                            className="pointer-events-auto px-4 py-1.5 bg-[var(--mafia-accent)]/20 hover:bg-[var(--mafia-accent)]/40 border border-[var(--mafia-accent)]/50 rounded text-[10px] uppercase tracking-widest text-[var(--mafia-accent)] transition-all"
                        >
                            Deal Again
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
