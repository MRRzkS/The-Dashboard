"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DollarSign, Plus, Minus, Trash2, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface Transaction {
    id: string;
    type: "collection" | "expense";
    amount: number;
    description: string;
    date: string;
}

export const BooksWidget = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    // Load from Session Storage
    useEffect(() => {
        setIsMounted(true);
        const saved = sessionStorage.getItem("mafia-books-ledger");
        if (saved) {
            try {
                setTransactions(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse ledger", e);
            }
        }
    }, []);

    // Save to Session Storage
    useEffect(() => {
        if (isMounted) {
            sessionStorage.setItem("mafia-books-ledger", JSON.stringify(transactions));
        }
    }, [transactions, isMounted]);

    const handleAdd = (type: "collection" | "expense") => {
        if (!amount || isNaN(Number(amount))) return;

        const newTransaction: Transaction = {
            id: Date.now().toString(),
            type,
            amount: Number(amount),
            description: description || (type === "collection" ? "Unspecified Collection" : "Unspecified Expense"),
            date: new Date().toLocaleDateString(),
        };

        setTransactions([newTransaction, ...transactions]);
        setAmount("");
        setDescription("");
    };

    const handleDelete = (id: string) => {
        setTransactions(transactions.filter(t => t.id !== id));
    };

    const totalBalance = useMemo(() => {
        return transactions.reduce((acc, curr) => {
            return curr.type === "collection" ? acc + curr.amount : acc - curr.amount;
        }, 0);
    }, [transactions]);

    if (!isMounted) return null;

    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between mb-4 z-10 relative">
                <div className="flex items-center gap-3">
                    <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-gray-300 flex items-center gap-2">
                        <Wallet size={20} className="text-[var(--mafia-accent)]" /> The Books
                    </h2>
                </div>
                <div className="text-xl font-mono font-bold text-white flex items-center gap-1">
                    <span className="text-[var(--mafia-muted)] text-xs uppercase tracking-widest mr-2">Net Worth</span>
                    <DollarSign size={16} className={totalBalance >= 0 ? "text-[var(--mafia-accent)]" : "text-red-500"} />
                    <span className={totalBalance >= 0 ? "text-[var(--mafia-accent)]" : "text-red-500"}>
                        {totalBalance.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Input Area */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Description (e.g. Protection Money)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex-[2] bg-black/40 border border-[var(--mafia-muted)]/30 rounded px-3 py-2 text-sm text-white placeholder:text-[var(--mafia-muted)] focus:outline-none focus:border-[var(--mafia-accent)] transition-colors"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-black/40 border border-[var(--mafia-muted)]/30 rounded px-3 py-2 text-sm text-white placeholder:text-[var(--mafia-muted)] focus:outline-none focus:border-[var(--mafia-accent)] transition-colors"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => handleAdd("collection")}
                    className="flex-1 bg-green-900/30 hover:bg-green-800/50 border border-green-500/30 text-green-400 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                    <Plus size={14} /> Add Collection
                </button>
                <button
                    onClick={() => handleAdd("expense")}
                    className="flex-1 bg-red-900/30 hover:bg-red-800/50 border border-red-500/30 text-red-400 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                    <Minus size={14} /> Add Expense
                </button>
            </div>

            {/* Transaction List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence initial={false}>
                    {transactions.length === 0 ? (
                        <div className="text-center text-[var(--mafia-muted)] text-xs italic py-8">
                            No records found. The books are clean.
                        </div>
                    ) : (
                        transactions.map((t) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center justify-between py-2 border-b border-[var(--mafia-muted)]/10 group"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-300 font-medium">{t.description}</span>
                                    <span className="text-[10px] text-[var(--mafia-muted)]">{t.date}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={cn("font-mono font-bold", t.type === "collection" ? "text-green-500" : "text-red-500")}>
                                        {t.type === "collection" ? "+" : "-"}${t.amount.toLocaleString()}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        className="text-[var(--mafia-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
};
