import { create } from 'zustand';
import type { V1Event, V1Relation } from '@omnsight/clients/dist/geovision/geovision.js';
import { Api as GeoApi } from '@omnsight/clients/dist/geovision/geovision.js';
import { Api as BaseApi } from '@omnsight/clients/dist/omnibasement/omnibasement.js';

interface AppState {
  // Data
  events: V1Event[];
  relations: V1Relation[];

  // API Client
  geoApi: GeoApi<any>;
  baseApi: BaseApi<any>;

  // Actions
  setEvents: (events: V1Event[], relations: V1Relation[]) => void;
  addEvent: (event: V1Event) => void;
}

export const useAppStore = create<AppState>((set) => ({
  events: [],
  relations: [],
  geoApi: new GeoApi({baseURL: import.meta.env.BASE_API_URL}),
  baseApi: new BaseApi({baseURL: import.meta.env.GEO_API_URL}),

  setEvents: (events, relations) => set({ events, relations }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
}));