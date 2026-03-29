import { create } from 'zustand';

interface WindowManagerState {
  active: string;
  floating: boolean;
  side?: 'top-right' | 'bottom-right';
}

interface WindowState {
  windowStates: Record<string, WindowManagerState>;
  topRightOpen: boolean;
  bottomRightOpen: boolean;
  actions: {
    registerManager: (managerName: string, initialWindowName:string, side?: 'top-right' | 'bottom-right') => void;
    setActiveWindow: (managerName: string, activeWindowName: string) => void;
    setTopRightOpen: (open: boolean) => void;
    setBottomRightOpen: (open: boolean) => void;
  };
}

export const useWindowStore = create<WindowState>((set, get) => ({
  windowStates: {},
  topRightOpen: false,
  bottomRightOpen: false,
  actions: {
    registerManager: (managerName, initialWindowName, side) => {
      if (get().windowStates[managerName]) {
        return;
      }
      console.debug('registerManager', managerName, initialWindowName, side);
      set((state) => ({
        windowStates: {
          ...state.windowStates,
          [managerName]: {
            active: initialWindowName,
            floating: side !== undefined,
            side,
          },
        },
      }));
    },
    setActiveWindow: (managerName, activeWindowName) => {
      console.debug('setActiveWindow', managerName, activeWindowName, get().windowStates[managerName]?.side);
      set((state) => ({
        windowStates: {
          ...state.windowStates,
          [managerName]: {
            ...state.windowStates[managerName],
            active: activeWindowName,
          },
        },
        topRightOpen: state.windowStates[managerName]?.side === 'top-right' ? true : state.topRightOpen,
        bottomRightOpen: state.windowStates[managerName]?.side === 'bottom-right' ? true : state.bottomRightOpen,
      }));
    },
    setTopRightOpen: (open) => set({ topRightOpen: open }),
    setBottomRightOpen: (open) => set({ bottomRightOpen: open }),
  },
}));

export const useWindowStoreActions = () => useWindowStore((s) => s.actions);
