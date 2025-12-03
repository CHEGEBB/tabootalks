import { create } from 'zustand';

interface UIStore {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  credits: number;
  setCredits: (credits: number) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),
  selectedImage: null,
  setSelectedImage: (selectedImage) => set({ selectedImage }),
  credits: 150,
  setCredits: (credits) => set({ credits }),
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));