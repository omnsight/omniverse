import { create } from 'zustand';

export type GraphViewMode = 'graph' | 'compare';

interface GraphToolState {
  viewMode: GraphViewMode;
  actions: {
    changeViewMode: (mode: GraphViewMode) => void;
  };
}

export const useGraphToolState = create<GraphToolState>()((set) => ({
  viewMode: 'graph',
  actions: {
    changeViewMode: (mode) => set({ viewMode: mode }),
  },
}));

export const useGraphToolStateActions = () => useGraphToolState((state) => state.actions);
