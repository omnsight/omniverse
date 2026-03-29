import type {
  Event,
  Organization,
  Person,
  Source,
  Website,
  Relation,
} from 'omni-osint-crud-client';
import { create } from 'zustand';

interface IdedEntity {
  _id?: string | null;
}

interface Entities {
  events?: Event[];
  organizations?: Organization[];
  people?: Person[];
  sources?: Source[];
  websites?: Website[];
  relations?: Relation[];
}

interface EntityDataState {
  queries: any[][];
  events: Event[];
  organizations: Organization[];
  persons: Person[];
  sources: Source[];
  websites: Website[];
  relations: Relation[];

  actions: {
    setEntities: (entities: Entities, query?: any[]) => void;
    addEntities: (entities: Entities, query?: any[]) => void;
  };
}

export const useEntityDataStore = create<EntityDataState>((set) => ({
  queries: [],
  events: [],
  organizations: [],
  persons: [],
  sources: [],
  websites: [],
  relations: [],

  actions: {
    setEntities: (entities: Entities, query?: any[]) =>
      set(() => ({
        queries: query ? [query] : [],
        events: entities.events || [],
        organizations: entities.organizations || [],
        persons: entities.people || [],
        sources: entities.sources || [],
        websites: entities.websites || [],
        relations: entities.relations || [],
      })),
    addEntities: (entities: Entities, query?: any[]) =>
      set((state) => {
        const upsert = (existing: IdedEntity[], incoming: IdedEntity[] | undefined) => {
          if (!incoming || incoming.length === 0) {
            return existing;
          }
          const incomingIds = new Set(incoming.map((item) => item._id));
          const filteredExisting = existing.filter((item) => !incomingIds.has(item._id));
          return [...filteredExisting, ...incoming];
        };

        return {
          queries: query ? [...state.queries, query] : state.queries,
          events: upsert(state.events, entities.events),
          organizations: upsert(state.organizations, entities.organizations),
          persons: upsert(state.persons, entities.people),
          sources: upsert(state.sources, entities.sources),
          websites: upsert(state.websites, entities.websites),
          relations: upsert(state.relations, entities.relations),
        };
      }),
  },
}));

export const useEntityDataActions = () => useEntityDataStore((state) => state.actions);
