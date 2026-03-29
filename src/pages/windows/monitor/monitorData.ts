import { create } from 'zustand';
import { type MonitoringSource } from 'omni-monitoring-client';

interface MonitorState {
  sources: MonitoringSource[];
  selected?: MonitoringSource;
  setSources: (sources: MonitoringSource[]) => void;
  setSelected: (source?: MonitoringSource) => void;
}

export const useMonitorStore = create<MonitorState>((set) => ({
  sources: [],
  selected: undefined,
  setSources: (sources) => set({ sources }),
  setSelected: (source) => set({ selected: source }),
}));
