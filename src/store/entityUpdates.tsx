import { create } from 'zustand';
import type { EntityType } from './graphData';
import type { V1Relation } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { Api } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { useLocalDataState } from './localData';

export type UpdatableItem = EntityType | V1Relation;

/**
 * Check if a value is empty (null, undefined, or empty string)
 */
const isEmpty = (val: any): boolean => val === null || val === undefined || val === '';

/**
 * Deep compare two values to check if they are different.
 * Treats null, undefined, and '' as equivalent.
 */
const isDifferent = (val1: any, val2: any): boolean => {
  // Handle empty values (null, undefined, "") as equivalent
  if (isEmpty(val1) && isEmpty(val2)) {
    return false;
  }

  // If one is empty and other is not (and not both empty handled above)
  if (isEmpty(val1) !== isEmpty(val2)) {
    return true;
  }

  // Deep compare objects/arrays
  if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
    // Arrays
    if (Array.isArray(val1) || Array.isArray(val2)) {
      // If one is array and other is not
      if (!Array.isArray(val1) || !Array.isArray(val2)) return true;
      // Simple array comparison
      return JSON.stringify(val1) !== JSON.stringify(val2);
    }

    // Objects
    const keys1 = Object.keys(val1);
    const keys2 = Object.keys(val2);

    // Union of keys
    const allKeys = new Set([...keys1, ...keys2]);
    for (const key of allKeys) {
      if (isDifferent(val1[key], val2[key])) {
        return true;
      }
    }
    return false;
  }

  return val1 !== val2;
};

/**
 * Returns a partial object containing only the fields from candidate that are different from original.
 */
export const getChangedFields = <T extends Record<string, any>>(
  candidate: Partial<T>,
  original: T,
): Partial<T> => {
  const result: Partial<T> = {};

  (Object.keys(candidate) as Array<keyof T>).forEach((key) => {
    const newVal = candidate[key];
    const origVal = original[key];
    if (isDifferent(newVal, origVal)) {
      result[key] = newVal;
    }
  });

  return result;
};

// --- Store ---

interface EntityUpdatesState {
  pendingUpdates: Record<string, Partial<UpdatableItem>>; // entityId -> partial update object
  actions: {
    setPendingUpdate: <T extends UpdatableItem>(
      entityId: string,
      updates: Partial<T>,
      original: T,
    ) => void;
    clearPendingUpdate: (entityId: string) => void;
    saveUpdates: <T extends UpdatableItem>(
      entityId: string,
      original: T,
      entityType: string,
      api: Api<unknown>,
    ) => Promise<void>;
  };
}

export const useEntityUpdatesState = create<EntityUpdatesState>((set, get) => ({
  pendingUpdates: {},

  actions: {
    setPendingUpdate: (entityId, updates, original) => {
      set((state) => {
        const currentPending = (state.pendingUpdates[entityId] || {}) as typeof updates;
        const candidate = { ...currentPending, ...updates };
        const nextPending = getChangedFields(candidate, original);

        // If no changes remain, remove the entry
        if (Object.keys(nextPending).length === 0) {
          const { [entityId]: _, ...rest } = state.pendingUpdates;
          return { pendingUpdates: rest };
        }

        return {
          pendingUpdates: {
            ...state.pendingUpdates,
            [entityId]: nextPending,
          },
        };
      });
    },

    clearPendingUpdate: (entityId) => {
      set((state) => {
        const { [entityId]: _, ...rest } = state.pendingUpdates;
        return { pendingUpdates: rest };
      });
    },

    saveUpdates: async (entityId, original, entityType, api) => {
      const pending = get().pendingUpdates[entityId];
      if (!pending || Object.keys(pending).length === 0) return;

      // Access localData actions directly
      const { addEntities, removeEntities, addRelations, removeRelations } =
        useLocalDataState.getState().actions;

      try {
        if (entityType === 'relation') {
          // Relation Logic
          if (entityId && entityId.startsWith('new')) {
            // Create
            const { id, key, rev, ...rest } = { ...original, ...pending };
            // @ts-ignore
            const res = await api.v1.relationshipServiceCreateRelationship(rest);

            if (res.data.relationship) {
              addRelations([res.data.relationship]);
              if (entityId) removeRelations([entityId]);
              get().actions.clearPendingUpdate(entityId);
            }
          } else {
            // Update
            const [collection, key] = entityId.split('/');
            // @ts-ignore
            const res = await api.v1.relationshipServiceUpdateRelationship(
              collection,
              key,
              pending,
            );
            if (res.data.relationship) {
              addRelations([res.data.relationship]);
              get().actions.clearPendingUpdate(entityId);
            }
          }
        } else {
          // Entity Logic
          if (entityId && entityId.startsWith('new')) {
            // Create
            const { id, key, rev, ...rest } = { ...original, ...pending };

            // Construct the payload dynamically based on entityType
            const payload = { [entityType]: rest };

            // @ts-ignore - Dynamic access to API method
            const res = await api.v1.entityServiceCreateEntity(entityType, payload);

            if (res.data.entity) {
              addEntities([res.data.entity]);
              if (entityId) removeEntities([entityId]);
              get().actions.clearPendingUpdate(entityId);
            }
          } else {
            // Update
            const payload = { [entityType]: pending };
            // @ts-ignore - Dynamic access to API method
            const res = await api.v1.entityServiceUpdateEntity(
              entityType,
              (original as any).key,
              payload,
            );

            if (res.data.entity) {
              addEntities([res.data.entity]);
              get().actions.clearPendingUpdate(entityId);
            }
          }
        }
      } catch (error) {
        throw error;
      }
    },
  },
}));

export const useEntityUpdatesActions = () => useEntityUpdatesState((state) => state.actions);

const EMPTY_UPDATE = {};

// Helper hook to get pending updates for a specific entity with proper typing
export const usePendingUpdates = <T extends UpdatableItem>(entityId: string): Partial<T> => {
  const update = useEntityUpdatesState((state) => state.pendingUpdates[entityId]);
  return (update || EMPTY_UPDATE) as Partial<T>;
};
