import { create } from 'zustand';

interface DraggingPayload {
  type: string;
  label: string;
  state: any;
}

interface WindowDragState {
  registry: Record<string, (state: any) => void>;
  activeDrag?: DraggingPayload;
  actions: {
    register: (type: string, restoreFn: (state: any) => void) => void;
    restore: (type: string, state: any) => void;
    setDragging: (data?: DraggingPayload) => void;
  };
}

export const useWindowDragStore = create<WindowDragState>((set, get) => ({
  registry: {},
  activeDrag: undefined,
  actions: {
    register: (type, restoreFn) => set((s) => ({ registry: { ...s.registry, [type]: restoreFn } })),
    restore: (type, state) => {
      const restoreFn = get().registry[type];
      if (restoreFn) restoreFn(state);
      else console.warn(`Restorer for ${type} not found.`);
    },
    setDragging: (activeDrag) => set({ activeDrag }),
  },
}));

export const useWindowDragStoreActions = () => useWindowDragStore((s) => s.actions);
