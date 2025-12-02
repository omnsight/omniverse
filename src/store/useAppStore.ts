import { create } from 'zustand';
import type { V1Event, V1Relation } from '@omnsight/clients/dist/geovision/geovision.js';
import { Api as GeoApi } from '@omnsight/clients/dist/geovision/geovision.js';
import { Api as BaseApi } from '@omnsight/clients/dist/omnibasement/omnibasement.js';
import { BASE_API_URL, GEO_API_URL } from '../constants';

interface User {
  name: string;
  email: string;
  roles: string[];
}

interface AppState {
  // User
  user: User | undefined;
  setUser: (user: User | undefined) => void;

  // Data
  events: V1Event[];
  relations: V1Relation[];

  // API Client
  geoApi: GeoApi<any>;
  baseApi: BaseApi<any>;

  // UI State
  activeTool: 'geovision' | 'admin';
  theme: 'light' | 'dark';

  // Actions
  setEvents: (events: V1Event[], relations: V1Relation[]) => void;
  addEvent: (event: V1Event) => void;
  setActiveTool: (tool: 'geovision' | 'admin') => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: undefined,
  events: [],
  relations: [],
  currentUser: null,
  geoApi: new GeoApi({baseURL: BASE_API_URL}),
  baseApi: new BaseApi({baseURL: GEO_API_URL}),
  activeTool: 'geovision',
  theme: 'dark', // Default to dark for OSINT feel

  filters: {
    searchQuery: '',
    country: null,
    adminArea: null,
    tags: [],
    roleFilter: [],
    timeRange: {
      start: new Date().setHours(0, 0, 0, 0),
      end: new Date().setHours(23, 59, 59, 999)
    }
  },

  setUser: (user) => set({ user }),
  setEvents: (events, relations) => set({ events, relations }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  setActiveTool: (tool) => set({ activeTool: tool }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
