import { create } from 'zustand';
import { type OsintView } from 'omni-osint-crud-client';

interface InsightState {
  insights: OsintView[];
  selected?: string;
  setInsights: (insights: OsintView[]) => void;
  setSelected: (id?: string) => void;
  getSelectedInsight: () => OsintView | undefined;
}

export const useInsightStore = create<InsightState>((set, get) => ({
  insights: [],
  selected: undefined,
  setInsights: (insights) => set({ insights }),
  setSelected: (id) => set({ selected: id }),
  getSelectedInsight: () => {
    const { insights, selected } = get();
    return insights.find((i) => i._id === selected);
  },
}));
