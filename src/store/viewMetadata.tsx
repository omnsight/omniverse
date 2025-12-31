import { create } from 'zustand';
import { useGraphToolState, type GraphViewMode } from './graphToolState';
import { useMapToolState, type RulerPoint, type ToolMode } from './mapToolState';
import { useSelection } from './selection';

export type EntityViewType = 'geovision' | 'sparkgraph';

export interface ViewMetadataItem {
  id: string;
  name: string;
  viewType: EntityViewType;
  graphViewMode: GraphViewMode;
  selectedIds: string[];
  timestamp: number;
  mapToolMode?: ToolMode;
  rulerPoints?: RulerPoint[];
}

interface ViewMetadataState {
  views: ViewMetadataItem[];
  activeViewId: string | null;
  actions: {
    addView: (name: string, viewType: EntityViewType) => ViewMetadataItem;
    restoreView: (view: ViewMetadataItem) => void;
    removeView: (id: string) => void;
    updateViewName: (id: string, name: string) => void;
    setActiveViewId: (id: string | null) => void;
    clearViews: () => void;
  };
}

export const useViewMetadataStore = create<ViewMetadataState>()((set, get) => ({
  views: [],
  activeViewId: null,
  actions: {
    addView: (name, viewType) => {
      // Get current state from other stores
      const graphViewMode = useGraphToolState.getState().viewMode;
      const selectedIds = useSelection.getState().selectedIds;
      const mapToolMode = useMapToolState.getState().mode;
      const rulerPoints = useMapToolState.getState().rulerPoints;

      const view: Omit<ViewMetadataItem, 'id' | 'timestamp'> = {
        name,
        viewType,
        graphViewMode,
        selectedIds,
        mapToolMode: viewType === 'geovision' ? mapToolMode : undefined,
        rulerPoints: viewType === 'geovision' ? rulerPoints : undefined,
      };

      // Generate deterministic ID based on content (excluding name/timestamp)
      const contentString = [
        view.viewType,
        view.graphViewMode,
        [...view.selectedIds].sort().join(','),
        view.mapToolMode || '',
        view.rulerPoints
          ? view.rulerPoints.map((p) => `${p.lat},${p.lng},${p.distanceFromStart}`).join('|')
          : '',
      ].join('|');

      let hash = 0;
      for (let i = 0; i < contentString.length; i++) {
        const char = contentString.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      const generatedId = Math.abs(hash).toString(36);

      const state = get(); // Get current state to check for duplicates
      if (state.views.some((v) => v.id === generatedId)) {
        throw new Error('Duplicate view metadata');
      }

      const newView = {
        ...view,
        id: generatedId,
        timestamp: Date.now(),
      };
      set((state) => ({
        views: [...state.views, newView],
        activeViewId: newView.id,
      }));
      return newView;
    },
    restoreView: (view) => {
      useGraphToolState.getState().actions.changeViewMode(view.graphViewMode);
      useSelection.getState().actions.set(view.selectedIds);
      if (view.viewType === 'geovision') {
        useMapToolState.getState().actions.setMode(view.mapToolMode || 'normal');
        useMapToolState.getState().actions.setRulerPoints(view.rulerPoints || []);
      }
      set({ activeViewId: view.id });
    },
    removeView: (id) =>
      set((state) => ({
        views: state.views.filter((v) => v.id !== id),
        activeViewId: state.activeViewId === id ? null : state.activeViewId,
      })),
    updateViewName: (id, name) =>
      set((state) => ({
        views: state.views.map((v) => (v.id === id ? { ...v, name } : v)),
      })),
    setActiveViewId: (id) => set({ activeViewId: id }),
    clearViews: () => set({ views: [], activeViewId: null }),
  },
}));

export const useViewMetadataActions = () => useViewMetadataStore((state) => state.actions);
