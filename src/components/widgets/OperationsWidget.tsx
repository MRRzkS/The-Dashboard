"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Calendar, Edit2, X, Check, RotateCcw } from "lucide-react";
import { cn } from "../../lib/utils";

// --- TYPES ---
type Priority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}

// --- MAIN WIDGET ---
export const OperationsWidget = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null); // If null, we are adding

  // 1. Load/Save
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
  const handleSave = (task: Task) => {
    if (editingTask) {
      // Update existing
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    } else {
      // Add new
      setTasks([task, ...tasks]);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const openAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-full w-full relative">
      
      {/* Header Control */}
      <div className="absolute -top-1 right-0 z-10">
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-3 py-1 rounded bg-[var(--mafia-accent)] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-lg"
        >
          <Plus size={12} /> Deal Card
        </button>
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-[var(--mafia-muted)] opacity-50">
          <div className="text-4xl mb-2">♠️</div>
          <span className="text-xs uppercase tracking-widest">The table is clear</span>
        </div>
      )}

      {/* CAROUSEL AREA: CSS Snap for smooth gliding */}
      <div className="flex-1 flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 px-4 pb-4 pt-12">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <div key={task.id} className="snap-center shrink-0 py-2">
              <PokerCard 
                task={task} 
                onEdit={() => openEditModal(task)}
                onDelete={() => handleDelete(task.id)}
                onToggleComplete={() => {
                   setTasks(tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t));
                }}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* MODAL (The Backroom) */}
      <AnimatePresence>
        {isModalOpen && (
          <TaskModal 
            existingTask={editingTask} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSave} 
          />
        )}
      </AnimatePresence>

    </div>
  );
};

// --- SUB-COMPONENT: The Poker Card ---
const PokerCard = ({ 
  task, 
  onEdit, 
  onDelete,
  onToggleComplete
}: { 
  task: Task; 
  onEdit: () => void; 
  onDelete: () => void;
  onToggleComplete: () => void;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getPriorityColor = (p: Priority) => {
    if (p === "high") return "border-[var(--mafia-danger)] text-[var(--mafia-danger)]";
    if (p === "medium") return "border-[var(--mafia-accent)] text-[var(--mafia-accent)]";
    return "border-[var(--mafia-muted)] text-[var(--mafia-muted)]";
  };

  return (
    <div className="relative w-48 h-64 md:w-52 md:h-72 perspective-1000 group">
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        
        {/* === FRONT (The Face Card) === */}
        <div 
          className={cn(
            "absolute inset-0 backface-hidden rounded-xl bg-[#151515] border-[3px] flex flex-col p-4 shadow-2xl",
            getPriorityColor(task.priority),
            task.completed ? "opacity-60 grayscale" : ""
          )}
        >
          {/* Top Corner Suit */}
          <div className="flex justify-between items-start">
             <span className="text-lg font-serif">
                {task.priority === 'high' ? 'A' : task.priority === 'medium' ? 'K' : 'J'}
             </span>
             <button 
               onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
               className={cn(
                 "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                 task.completed ? "bg-current text-black" : "border-current hover:bg-white/10"
               )}
             >
               {task.completed && <Check size={12} />}
             </button>
          </div>

          {/* Center Title */}
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
             <div className="text-2xl mb-1">{task.priority === 'high' ? '♠️' : task.priority === 'medium' ? '♦️' : '♣️'}</div>
             <h3 className="font-[family-name:var(--font-cinzel)] text-lg leading-tight text-gray-200 line-clamp-3">
               {task.title}
             </h3>
             {task.dueDate && (
               <span className="text-[10px] uppercase tracking-wider opacity-70 mt-1 border-t border-current pt-1">
                 {task.dueDate}
               </span>
             )}
          </div>

          {/* Bottom Flip Trigger */}
          <button 
             onClick={() => setIsFlipped(true)}
             className="mt-auto w-full py-2 text-[10px] uppercase tracking-widest border border-current/30 hover:bg-white/5 rounded transition-colors"
          >
            Details &rarr;
          </button>
        </div>

        {/* === BACK (The Details) === */}
        <div 
          className="absolute inset-0 backface-hidden rounded-xl bg-[#1a1a1a] border border-[var(--mafia-muted)] flex flex-col p-4 shadow-2xl rotate-y-180"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3 border-b border-[var(--mafia-muted)]/30 pb-2">
            <span className="text-[10px] uppercase text-[var(--mafia-muted)]">Dossier</span>
            <button onClick={() => setIsFlipped(false)} className="text-[var(--mafia-muted)] hover:text-white">
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Description */}
          <div className="flex-1 overflow-y-auto no-scrollbar text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
            {task.description || <span className="italic text-[var(--mafia-muted)]">No intel provided.</span>}
          </div>

          {/* Actions */}
          <div className="mt-3 flex gap-2">
             <button 
               onClick={onEdit}
               className="flex-1 py-2 flex items-center justify-center gap-1 rounded border border-[var(--mafia-muted)] text-[var(--mafia-muted)] text-[10px] hover:border-[var(--mafia-accent)] hover:text-[var(--mafia-accent)] transition-colors"
             >
               <Edit2 size={10} /> Edit
             </button>
             <button 
               onClick={onDelete}
               className="flex-1 py-2 flex items-center justify-center gap-1 rounded border border-[var(--mafia-danger)]/50 text-[var(--mafia-danger)] text-[10px] hover:bg-[var(--mafia-danger)] hover:text-white transition-colors"
             >
               <Trash2 size={10} /> Burn
             </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

// --- SUB-COMPONENT: The Modal Form ---
const TaskModal = ({ 
  existingTask, 
  onClose, 
  onSave 
}: { 
  existingTask: Task | null; 
  onClose: () => void; 
  onSave: (t: Task) => void; 
}) => {
  const [title, setTitle] = useState(existingTask?.title || "");
  const [desc, setDesc] = useState(existingTask?.description || "");
  const [date, setDate] = useState(existingTask?.dueDate || "");
  const [priority, setPriority] = useState<Priority>(existingTask?.priority || "medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      id: existingTask?.id || Date.now().toString(),
      title,
      description: desc,
      dueDate: date,
      priority,
      completed: existingTask?.completed || false,
    });
  };

  // ... inside TaskModal component ...
  return (
    // CHANGED: 'fixed' instead of 'absolute', added z-[9999] to sit on top of everything
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-sm bg-[#111] border border-[var(--mafia-accent)] rounded-lg p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative"
      >

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div>
             <label className="text-[10px] uppercase tracking-widest text-[var(--mafia-muted)] block mb-1">Objective</label>
             <input 
               value={title}
               onChange={e => setTitle(e.target.value)}
               className="w-full bg-[var(--mafia-surface)] border border-[var(--mafia-muted)]/30 rounded p-2 text-sm text-white focus:border-[var(--mafia-accent)] outline-none"
               placeholder="e.g. Acquire the asset"
               autoFocus
             />
          </div>

          {/* Priority */}
          <div>
             <label className="text-[10px] uppercase tracking-widest text-[var(--mafia-muted)] block mb-1">Priority Level</label>
             <div className="flex gap-2">
               {(["low", "medium", "high"] as Priority[]).map(p => (
                 <button
                   key={p}
                   type="button"
                   onClick={() => setPriority(p)}
                   className={cn(
                     "flex-1 py-2 text-xs uppercase border rounded transition-all",
                     priority === p 
                       ? "border-[var(--mafia-accent)] bg-[var(--mafia-accent)] text-black font-bold"
                       : "border-[var(--mafia-muted)] text-[var(--mafia-muted)] hover:border-gray-400"
                   )}
                 >
                   {p}
                 </button>
               ))}
             </div>
          </div>

          {/* Date */}
          <div>
             <label className="text-[10px] uppercase tracking-widest text-[var(--mafia-muted)] block mb-1">Deadline</label>
             <input 
               type="date"
               value={date}
               onChange={e => setDate(e.target.value)}
               className="w-full bg-[var(--mafia-surface)] border border-[var(--mafia-muted)]/30 rounded p-2 text-sm text-[var(--mafia-muted)] focus:border-[var(--mafia-accent)] outline-none color-scheme-dark"
             />
          </div>

          {/* Description */}
          <div>
             <label className="text-[10px] uppercase tracking-widest text-[var(--mafia-muted)] block mb-1">Intel / Details</label>
             <textarea 
               value={desc}
               onChange={e => setDesc(e.target.value)}
               className="w-full bg-[var(--mafia-surface)] border border-[var(--mafia-muted)]/30 rounded p-2 text-sm text-gray-300 focus:border-[var(--mafia-accent)] outline-none h-20 resize-none"
               placeholder="Specific instructions..."
             />
          </div>

          {/* Submit */}
          <button 
            type="submit"
            className="w-full py-3 mt-2 bg-[var(--mafia-accent)] text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-white transition-colors"
          >
            {existingTask ? "Update Contract" : "Sign Contract"}
          </button>

        </form>
      </motion.div>
    </div>
  );
};