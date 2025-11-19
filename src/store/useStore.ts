import { create } from 'zustand';

type Mode = 'focus' | 'relax';

interface DashboardState {
  mode: Mode;
  toggleMode: () => void;
  setMode: (mode: Mode) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  mode: 'focus', // We start ready for business
  toggleMode: () => set((state) => ({ 
    mode: state.mode === 'focus' ? 'relax' : 'focus' 
  })),
  setMode: (mode) => set({ mode }),
}));