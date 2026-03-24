import { create } from 'zustand';

interface MultiWindowState {
  windowStates: Record<string, string>; // { [managerName: string]: activeWindowName }
  actions: {
    registerManager: (managerName: string, initialWindowName:string) => void;
    setActiveWindow: (managerName: string, activeWindowName: string) => void;
  };
}

export const useMultiWindowStore = create<MultiWindowState>((set, get) => ({
  windowStates: {},
  actions: {
    registerManager: (managerName, initialWindowName) => {
      if (get().windowStates[managerName]) {
        return; // Already registered
      }
      set((state) => ({
        windowStates: {
          ...state.windowStates,
          [managerName]: initialWindowName,
        },
      }));
    },
    setActiveWindow: (managerName, activeWindowName) => {
      set((state) => ({
        windowStates: {
          ...state.windowStates,
          [managerName]: activeWindowName,
        },
      }));
    },
  },
}));

export const useMultiWindowStoreActions = () => useMultiWindowStore((s) => s.actions);
