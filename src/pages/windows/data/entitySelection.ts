import { create } from 'zustand';
import { useEntityDataStore } from '../network/entityData';
import type { Entity } from '../../../components/forms/entityForm/entity';

interface EntitySelectionState {
  selectedIds: string[];
  actions: {
    setSelections: (ids: string[]) => void;
    addSelections: (ids: string[]) => void;
    removeSelections: (ids: string[]) => void;
    clearSelections: () => void;
  };
}

export const useEntitySelectionStore = create<EntitySelectionState>((set) => {
  // Helper to verify if an ID exists in any collection of the data store
  const verifyIdsExist = (ids: string[]) => {
    const data = useEntityDataStore.getState();
    const allIds = new Set([
      ...data.events.map((e) => e._id),
      ...data.organizations.map((o) => o._id),
      ...data.persons.map((p) => p._id),
      ...data.sources.map((s) => s._id),
      ...data.websites.map((w) => w._id),
      ...data.relations.map((r) => r._id),
    ]);
    return ids.filter((id) => allIds.has(id));
  };

  return {
    selectedIds: [],
    actions: {
      setSelections: (ids) => {
        const validIds = verifyIdsExist(ids);
        set({ selectedIds: validIds });
      },
      addSelections: (ids) =>
        set((state) => {
          const validIds = verifyIdsExist(ids);
          const newIds = Array.from(new Set([...state.selectedIds, ...validIds]));
          return { selectedIds: newIds };
        }),
      removeSelections: (ids) =>
        set((state) => ({
          selectedIds: state.selectedIds.filter((id) => !ids.includes(id)),
        })),
      clearSelections: () => set({ selectedIds: [] }),
    },
  };
});

export const useEntitySelectionActions = () => useEntitySelectionStore((state) => state.actions);

export const useSelectedEntities = (): Entity[] => {
  const selectedIds = useEntitySelectionStore((state) => state.selectedIds);
  const data = useEntityDataStore();

  return selectedIds.reduce<Entity[]>((acc, id) => {
    // Check each collection to find the entity and its inferred type
    const person = data.persons.find((p) => p._id === id);
    if (person) return [...acc, { type: 'Person', data: person }];

    const org = data.organizations.find((o) => o._id === id);
    if (org) return [...acc, { type: 'Organization', data: org }];

    const event = data.events.find((e) => e._id === id);
    if (event) return [...acc, { type: 'Event', data: event }];

    const source = data.sources.find((s) => s._id === id);
    if (source) return [...acc, { type: 'Source', data: source }];

    const website = data.websites.find((w) => w._id === id);
    if (website) return [...acc, { type: 'Website', data: website }];

    const relation = data.relations.find((r) => r._id === id);
    if (relation) return [...acc, { type: 'Relation', data: relation }];

    return acc;
  }, []);
};
