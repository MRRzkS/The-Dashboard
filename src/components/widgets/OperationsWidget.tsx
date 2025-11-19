"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2, Calendar, AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { cn } from "../../lib/utils";
import { format } from "date-fns";

// Types
type Priority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}

export const OperationsWidget = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // Carousel Ref
  const constraintsRef = useRef(null);

  // 1. Load/Save Logic (Session Storage)
  useEffect(() => {
    setIsMounted(true);
    const saved = sessionStorage.getItem("mafia-operations-deck");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (isMounted) {
      sessionStorage.setItem("mafia-operations-deck", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  // 2. Actions
  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: "New Objective",
      description: "",
      dueDate: "",
      priority: "medium",
      completed: false,
    };
    // Add to the FRONT of the deck
    setTasks([newTask, ...tasks]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative">
      
      {/* Header Control */}
      <div className="absolute top-0 right-0 z-20">
        <button
          onClick={addTask}
          className="flex items-center gap-2 px-3 py-1 rounded bg-[var(--mafia-accent)] text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
        >
          <Plus size={14} /> Deal Card
        </button>
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-[var(--mafia-muted)] opacity-50">
          <div className="text-4xl mb-2">♠️</div>
          <span className="text-xs uppercase tracking-widest">The table is clear</span>
        </div>
      )}

      {/* THE CAROUSEL AREA */}
      {/* We use a constraints ref to define the drag area */}
      <div className="flex-1 pt-8 pb-2 overflow-hidden" ref={constraintsRef}>
        <motion.div 
          className="flex gap-4 px-2 cursor-grab active:cursor-grabbing h-full items-center"
          drag="x"
          dragConstraints={constraintsRef} // Prevents dragging too far
          dragElastic={0.1}
        >
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <OperationCard 
                key={task.id} 
                task={task} 
                onUpdate={updateTask} 
                onDelete={deleteTask} 
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

    </div>
  );
};

// ==========================================
// SUB-COMPONENT: The Flip Card
// ==========================================

const OperationCard = ({ 
  task, 
  onUpdate, 
  onDelete 
}: { 
  task: Task; 
  onUpdate: (id: string, u: Partial<Task>) => void; 
  onDelete: (id: string) => void;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Priority Colors
  const getPriorityColor = (p: Priority) => {
    if (p === "high") return "border-[var(--mafia-danger)] text-[var(--mafia-danger)]";
    if (p === "medium") return "border-[var(--mafia-accent)] text-[var(--mafia-accent)]";
    return "border-[var(--mafia-muted)] text-[var(--mafia-muted)]";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, x: -50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      className="relative w-64 h-60 shrink-0 perspective-1000"
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        
        {/* === FRONT OF CARD === */}
        <div 
          className={cn(
            "absolute inset-0 backface-hidden rounded-lg bg-[var(--mafia-surface)] border-2 flex flex-col p-4 shadow-xl hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-shadow",
            getPriorityColor(task.priority),
            task.completed ? "opacity-50 grayscale" : ""
          )}
        >
          {/* Priority Badge */}
          <div className="flex justify-between items-start mb-2">
            <div className="text-[10px] uppercase tracking-widest font-bold border px-2 py-0.5 rounded">
              {task.priority} Priority
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdate(task.id, { completed: !task.completed }); }}
              className={cn(
                "p-1 rounded-full border transition-colors",
                task.completed ? "bg-[var(--mafia-accent)] border-[var(--mafia-accent)] text-black" : "border-current hover:bg-white/10"
              )}
            >
              <CheckCircle2 size={16} />
            </button>
          </div>

          {/* Title Display */}
          <div className="flex-1 flex flex-col justify-center text-center">
            <h3 className={cn(
              "font-[family-name:var(--font-cinzel)] text-xl leading-tight break-words text-gray-200",
              task.completed && "line-through text-[var(--mafia-muted)]"
            )}>
              {task.title}
            </h3>
             {task.dueDate && (
               <div className="mt-2 text-xs text-[var(--mafia-muted)] flex items-center justify-center gap-1">
                 <Calendar size={10} /> {task.dueDate}
               </div>
             )}
          </div>

          {/* Flip Button */}
          <button 
            onClick={() => setIsFlipped(true)}
            className="w-full py-2 mt-auto text-xs uppercase tracking-widest border-t border-[var(--mafia-muted)]/30 hover:bg-white/5 transition-colors text-[var(--mafia-muted)]"
          >
            View Details &rarr;
          </button>
        </div>

        {/* === BACK OF CARD (EDIT MODE) === */}
        <div 
          className="absolute inset-0 backface-hidden rounded-lg bg-[var(--mafia-base)] border border-[var(--mafia-muted)] flex flex-col p-4 shadow-xl rotate-y-180"
          style={{ transform: "rotateY(180deg)" }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3 border-b border-[var(--mafia-muted)]/30 pb-2">
            <span className="text-[10px] uppercase text-[var(--mafia-muted)]">Edit Intel</span>
            <button onClick={() => setIsFlipped(false)} className="text-[var(--mafia-muted)] hover:text-white">
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Inputs */}
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
            
            {/* Title Input */}
            <input 
              value={task.title}
              onChange={(e) => onUpdate(task.id, { title: e.target.value })}
              className="bg-transparent border-b border-[var(--mafia-muted)] text-sm text-white focus:border-[var(--mafia-accent)] outline-none pb-1 font-bold"
              placeholder="Operation Name"
            />

            {/* Priority Selector */}
            <div className="flex gap-1 mt-1">
              {(["low", "medium", "high"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => onUpdate(task.id, { priority: p })}
                  className={cn(
                    "flex-1 text-[10px] uppercase py-1 border rounded transition-colors",
                    task.priority === p 
                      ? "border-[var(--mafia-accent)] text-[var(--mafia-accent)] bg-[var(--mafia-accent)]/10" 
                      : "border-[var(--mafia-muted)] text-[var(--mafia-muted)] hover:border-white"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Date Input */}
            <input 
              type="date" 
              value={task.dueDate}
              onChange={(e) => onUpdate(task.id, { dueDate: e.target.value })}
              className="bg-transparent text-xs text-[var(--mafia-muted)] border border-[var(--mafia-muted)]/30 rounded p-1 mt-1 w-full color-scheme-dark"
            />

            {/* Description */}
            <textarea 
              value={task.description}
              onChange={(e) => onUpdate(task.id, { description: e.target.value })}
              placeholder="Details..."
              className="bg-transparent text-xs text-gray-300 resize-none focus:outline-none mt-2 h-full min-h-[40px]"
            />
          </div>

          {/* Delete */}
          <button 
            onClick={() => onDelete(task.id)}
            className="mt-2 flex items-center justify-center gap-2 text-xs text-[var(--mafia-danger)] hover:bg-[var(--mafia-danger)]/10 py-1 rounded transition-colors w-full"
          >
            <Trash2 size={12} /> Burn Card
          </button>

        </div>
      </motion.div>
    </motion.div>
  );
};