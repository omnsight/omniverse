import { create } from 'zustand';
import { useLocalDataState } from './localData';

interface SelectionState {
  selectedIds: string[];
  actions: {
    select: (ids: string[]) => void;
    clear: () => void;
  };
}

const checkExists = (state: any, id: string): boolean => {
  return (
    state.events?.has(id) ||
    state.persons?.has(id) ||
    state.organizations?.has(id) ||
    state.websites?.has(id) ||
    state.sources?.has(id) ||
    state.relations?.has(id)
  );
};

export const useSelection = create<SelectionState>((set) => ({
  selectedIds: [],
  actions: {
    select: (ids: string[]) =>
      set((state) => {
        const localData = useLocalDataState.getState();
        const validIds = ids.filter((id) => checkExists(localData, id));

        if (validIds.length === 0) return state;

        const newSelectedIds = new Set(state.selectedIds);

        validIds.forEach((id) => {
          if (newSelectedIds.has(id)) {
            newSelectedIds.delete(id);
          } else {
            newSelectedIds.add(id);
          }
        });

        return { selectedIds: Array.from(newSelectedIds) };
      }),
    clear: () => set({ selectedIds: [] }),
  },
}));

export const useSelectionActions = () => useSelection((state) => state.actions);

// Subscribe to localData to remove deleted entities from selection
useLocalDataState.subscribe((localData) => {
  const selectionState = useSelection.getState();
  const { selectedIds } = selectionState;

  if (selectedIds.length === 0) return;

  const validIds = selectedIds.filter((id) => checkExists(localData, id));

  if (validIds.length !== selectedIds.length) {
    useSelection.setState({ selectedIds: validIds });
  }
});
