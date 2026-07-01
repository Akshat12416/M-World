import { create } from 'zustand';

interface AppState {
  activeSection: number;
  setActiveSection: (section: number) => void;
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
  prefersReducedMotion: boolean;
  setPrefersReducedMotion: (prefersReducedMotion: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  activeSection: 0,
  setActiveSection: (section) => set({ activeSection: section }),
  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),
  prefersReducedMotion: false,
  setPrefersReducedMotion: (prefersReducedMotion) => set({ prefersReducedMotion }),
}));
