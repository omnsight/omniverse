import { create } from 'zustand';
import React from 'react';

interface DataWindowManagerState {
  windows: { name: string; component: React.FC }[];
  activeIndex: number;
  actions: {
    registerWindow: (name: string, component: React.FC) => void;
    setActiveWindow: (index: number) => void;
    setActiveWindowByName: (name: string) => void;
    nextWindow: () => void;
  };
}

export const useDataWindowManagerStore = create<DataWindowManagerState>((set, get) => ({
  windows: [],
  activeIndex: 0,
  actions: {
    registerWindow: (name, component) =>
      set((state) => ({
        windows: [...state.windows, { name, component }],
      })),
    setActiveWindow: (index) => {
      if (index >= 0 && index < get().windows.length) {
        set({ activeIndex: index });
      }
    },
    setActiveWindowByName: (name) => {
      const index = get().windows.findIndex((w) => w.name === name);
      if (index !== -1) {
        set({ activeIndex: index });
      }
    },
    nextWindow: () =>
      set((state) => ({
        activeIndex: (state.activeIndex + 1) % state.windows.length,
      })),
  },
}));

export const useDataWindowManagerActions = () =>
  useDataWindowManagerStore((state) => state.actions);
