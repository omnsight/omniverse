import { create } from 'zustand';

interface NavColorState {
  navColor: string;
  setNavColor: (color: string) => void;
}

export const useNavColorStore = create<NavColorState>((set) => ({
  navColor: '--mantine-color-body',
  setNavColor: (color) => set({ navColor: color }),
}));
