"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Plus, Trash2, Edit2, Check, RotateCcw, Archive, LayoutGrid } from "lucide-react";
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
  const [viewMode, setViewMode] = useState<"active" | "archive">("active");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null); // If null, we are adding

  // Carousel Ref
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

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

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, [tasks, viewMode]);

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

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  if (!isMounted) return null;

  const filteredTasks = tasks.filter(t => viewMode === "active" ? !t.completed : t.completed);

  return (
    <div className="flex flex-col h-full w-full relative">

      {/* Header Control */}
      <div className="absolute -top-1 right-0 z-10 flex gap-2">
        <button
          onClick={() => setViewMode(viewMode === "active" ? "archive" : "active")}
          className={cn(
            "flex items-center gap-2 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-colors shadow-lg border",
            viewMode === "archive"
              ? "bg-[var(--mafia-accent)] text-black border-[var(--mafia-accent)]"
              : "bg-black/50 text-[var(--mafia-muted)] border-[var(--mafia-muted)] hover:text-white hover:border-white"
          )}
        >
          {viewMode === "active" ? <Archive size={12} /> : <LayoutGrid size={12} />}
          {viewMode === "active" ? "The Archive" : "Active Contracts"}
        </button>

        {viewMode === "active" && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-3 py-1 rounded bg-[var(--mafia-accent)] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-lg"
          >
            <Plus size={12} /> Deal Card
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-[var(--mafia-muted)] opacity-50">
          <div className="text-4xl mb-2">{viewMode === "active" ? "♠️" : "🗄️"}</div>
          <span className="text-xs uppercase tracking-widest">
            {viewMode === "active" ? "The table is clear" : "The archive is empty"}
          </span>
        </div>
      )}

      {/* CAROUSEL AREA: Draggable Framer Motion */}
      <div className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing pt-12" ref={carouselRef}>
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          className="flex gap-6 px-4 pb-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                className="shrink-0 py-2"
              >
                <PokerCard
                  task={task}
                  onEdit={() => openEditModal(task)}
                  onDelete={() => handleDelete(task.id)}
                  onToggleComplete={() => toggleTaskCompletion(task.id)}
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
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
  onToggleComplete,
  viewMode
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
  viewMode: "active" | "archive";
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const x = useMotionValue(0);
  const rotateY = useTransform(x, [-200, 200], [-30, 30]); // Tilt effect on drag

  // We use a separate state for the "flip" animation to decouple it from the drag
  // But we want to trigger flip on gesture or click

  const handlePanEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If panned significantly horizontally, maybe we don't flip (that's for carousel)
    // But if we want a specific gesture for flip...
    // Let's just use a simple click for now, but animate it nicely.
    // Or maybe a vertical drag?
    if (Math.abs(info.offset.y) > 50) {
      setIsFlipped(!isFlipped);
    }
  };

  const getPriorityColor = (p: Priority) => {
    if (p === "high") return "border-[var(--mafia-danger)] text-[var(--mafia-danger)]";
    if (p === "medium") return "border-[var(--mafia-accent)] text-[var(--mafia-accent)]";
    return "border-[var(--mafia-muted)] text-[var(--mafia-muted)]";
  };

  return (
    <div className="relative w-48 h-64 md:w-52 md:h-72 perspective-1000 group" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-700"
        animate={{ rotateY: isFlipped ? 180 : 0, rotateZ: isFlipped ? 5 : 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
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
                "w-6 h-6 rounded-full border flex items-center justify-center transition-colors z-20",
                task.completed ? "bg-current text-black" : "border-current hover:bg-white/10"
              )}
            >
              {task.completed ? <RotateCcw size={12} /> : <Check size={12} />}
            </button>
          </div>

          {/* Center Title */}
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
            <div className="text-2xl mb-1">{task.priority === 'high' ? '♠️' : task.priority === 'medium' ? '♦️' : '♣️'}</div>
            <h3 className="font-[family-name:var(--font-cinzel)] text-lg leading-tight text-gray-200 line-clamp-3 select-none">
              {task.title}
            </h3>
            {task.dueDate && (
              <span className="text-[10px] uppercase tracking-wider opacity-70 mt-1 border-t border-current pt-1">
                {task.dueDate}
              </span>
            )}
          </div>

          {/* Bottom Hint */}
          <div className="mt-auto w-full text-center opacity-50">
            <span className="text-[9px] uppercase tracking-widest">Tap to Flip</span>
          </div>
        </div>

        {/* === BACK (The Details) === */}
        <div
          className="absolute inset-0 backface-hidden rounded-xl bg-[#1a1a1a] border border-[var(--mafia-muted)] flex flex-col p-4 shadow-2xl rotate-y-180"
          onClick={(e) => e.stopPropagation()} // Prevent flipping back when interacting with content? No, we want to flip back on click
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3 border-b border-[var(--mafia-muted)]/30 pb-2">
            <span className="text-[10px] uppercase text-[var(--mafia-muted)]">Dossier</span>
            <button onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }} className="text-[var(--mafia-muted)] hover:text-white">
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Description */}
          <div className="flex-1 overflow-y-auto no-scrollbar text-xs text-gray-300 leading-relaxed whitespace-pre-wrap select-text" onPointerDown={(e) => e.stopPropagation()}>
            {task.description || <span className="italic text-[var(--mafia-muted)]">No intel provided.</span>}
          </div>

          {/* Actions */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="flex-1 py-2 flex items-center justify-center gap-1 rounded border border-[var(--mafia-muted)] text-[var(--mafia-muted)] text-[10px] hover:border-[var(--mafia-accent)] hover:text-[var(--mafia-accent)] transition-colors"
            >
              <Edit2 size={10} /> Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
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

  return (
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

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-[var(--mafia-muted)] text-[10px] uppercase tracking-widest hover:text-white transition-colors"
          >
            Cancel
          </button>

        </form>
      </motion.div>
    </div>
  );
};