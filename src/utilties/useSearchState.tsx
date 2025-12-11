import type { V1LocationData } from '@omnsight/clients/dist/geovision/geovision';
import { create } from 'zustand';

type DateRange = [Date | null, Date | null];

interface SearchState {
  query: string;
  location: V1LocationData | undefined;
  dateRange: DateRange;

  actions: {
    setQuery: (query: string) => void;
    setLocation: (location: V1LocationData | undefined) => void;
    setDateRange: (dateRange: DateRange) => void;
  }
}

export const useSearchState = create<SearchState>((set) => ({
  query: '',
  location: undefined,
  dateRange: [null, null],

  actions: {
    setQuery: (query) => set({ query }),
    setLocation: (location) => set({ location }),
    setDateRange: (dateRange) => set({ dateRange }),
  }
}));

export const useSearchActions = () => useSearchState((state) => state.actions);
