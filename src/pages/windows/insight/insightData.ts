import { create } from 'zustand';
import { type OsintView } from 'omni-osint-crud-client';

interface InsightState {
  insights: OsintView[];
  selected?: OsintView;
  setInsights: (insights: OsintView[]) => void;
  setSelected: (insight?: OsintView) => void;
}

export const useInsightStore = create<InsightState>((set) => ({
  insights: [],
  selected: undefined,
  setInsights: (insights) => set({ insights }),
  setSelected: (insight) => set({ selected: insight }),
}));
