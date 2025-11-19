"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, Check, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export const OperationsWidget = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // 1. Load from Session Storage on startup
  useEffect(() => {
    setIsMounted(true);
    const saved = sessionStorage.getItem("mafia-operations");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // 2. Save to Session Storage whenever tasks change
  useEffect(() => {
    if (isMounted) {
      sessionStorage.setItem("mafia-operations", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setInputValue("");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Input Area */}
      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add new objective..."
          className="flex-1 bg-transparent border-b border-[var(--mafia-muted)] text-white p-2 focus:outline-none focus:border-[var(--mafia-accent)] transition-colors placeholder:text-[var(--mafia-muted)] font-[family-name:var(--font-inter)]"
        />
        <button
          type="submit"
          className="p-2 text-[var(--mafia-accent)] hover:text-white transition-colors"
        >
          <Plus size={20} />
        </button>
      </form>

      {/* The List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {tasks.length === 0 && (
          <div className="text-[var(--mafia-muted)] text-sm italic text-center mt-10">
            "No loose ends."
          </div>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "group flex items-center justify-between p-3 rounded border transition-all duration-300",
              task.completed
                ? "border-transparent bg-[var(--mafia-surface)]/30 opacity-50"
                : "border-[var(--mafia-muted)]/40 bg-[var(--mafia-surface)]/50 hover:border-[var(--mafia-accent)]/50"
            )}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Custom Checkbox */}
              <button
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "w-5 h-5 rounded-sm border flex items-center justify-center transition-colors shrink-0",
                  task.completed
                    ? "bg-[var(--mafia-accent)] border-[var(--mafia-accent)]"
                    : "border-[var(--mafia-muted)] hover:border-[var(--mafia-accent)]"
                )}
              >
                {task.completed && <Check size={12} className="text-black" />}
              </button>
              
              <span
                className={cn(
                  "truncate text-sm font-[family-name:var(--font-inter)]",
                  task.completed ? "line-through text-[var(--mafia-muted)]" : "text-gray-200"
                )}
              >
                {task.text}
              </span>
            </div>

            {/* Delete Button (Hidden until hover) */}
            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 text-[var(--mafia-muted)] hover:text-[var(--mafia-danger)] transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};