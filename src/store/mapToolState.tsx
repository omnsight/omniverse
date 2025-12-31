import { create } from 'zustand';

// --- TYPES ---
export interface RulerPoint {
  lat: number;
  lng: number;
  distanceFromStart: number; // in meters
}

export type ToolMode = 'normal' | 'ruler';

export interface MapToolState {
  mode: ToolMode;
  rulerPoints: RulerPoint[];
  actions: {
    setMode: (mode: ToolMode) => void;
    setRulerPoints: (points: RulerPoint[]) => void;
    addRulerPoint: (point: RulerPoint) => void;
    removeLastRulerPoint: () => void;
    clearRulerPoints: () => void;
  };
}

export const useMapToolState = create<MapToolState>((set) => ({
  mode: 'normal',
  rulerPoints: [],
  actions: {
    setMode: (mode) => set({ mode }),
    setRulerPoints: (points) => set({ rulerPoints: points }),
    addRulerPoint: (point) =>
      set((state) => ({ rulerPoints: [...state.rulerPoints, point] })),
    removeLastRulerPoint: () =>
      set((state) => ({ rulerPoints: state.rulerPoints.slice(0, -1) })),
    clearRulerPoints: () => set({ rulerPoints: [] }),
  },
}));

export const useMapToolActions = () => useMapToolState((state) => state.actions);
