import type {
  V1Entity,
  V1Event,
  V1Person,
  V1Organization,
  V1Website,
  V1Source,
  V1Relation,
} from '@omnsight/clients/dist/omndapi/omndapi.js';
import { create } from 'zustand';
import { useMemo } from 'react';

interface LocalDataState {
  events: Map<string, V1Event>;
  persons: Map<string, V1Person>;
  organizations: Map<string, V1Organization>;
  websites: Map<string, V1Website>;
  sources: Map<string, V1Source>;
  relations: Map<string, V1Relation>;

  actions: {
    setEntities: (entities: V1Entity[]) => void;
    addEntities: (entities: V1Entity[]) => void;
    setRelations: (relations: V1Relation[]) => void;
    addRelations: (relations: V1Relation[]) => void;
  };
}

export const useLocalDataState = create<LocalDataState>((set) => ({
  events: new Map(),
  persons: new Map(),
  organizations: new Map(),
  websites: new Map(),
  sources: new Map(),
  relations: new Map(),

  actions: {
    setEntities: (entities) => {
      const events = new Map<string, V1Event>();
      const persons = new Map<string, V1Person>();
      const organizations = new Map<string, V1Organization>();
      const websites = new Map<string, V1Website>();
      const sources = new Map<string, V1Source>();

      entities.forEach((e) => {
        if (e.event?.id) events.set(e.event.id, e.event);
        if (e.person?.id) persons.set(e.person.id, e.person);
        if (e.organization?.id) organizations.set(e.organization.id, e.organization);
        if (e.website?.id) websites.set(e.website.id, e.website);
        if (e.source?.id) sources.set(e.source.id, e.source);
      });

      set({
        events,
        persons,
        organizations,
        websites,
        sources,
      });
    },
    addEntities: (entities) =>
      set((state) => {
        const events = new Map(state.events);
        const persons = new Map(state.persons);
        const organizations = new Map(state.organizations);
        const websites = new Map(state.websites);
        const sources = new Map(state.sources);

        entities.forEach((e) => {
          if (e.event?.id) events.set(e.event.id, e.event);
          if (e.person?.id) persons.set(e.person.id, e.person);
          if (e.organization?.id) organizations.set(e.organization.id, e.organization);
          if (e.website?.id) websites.set(e.website.id, e.website);
          if (e.source?.id) sources.set(e.source.id, e.source);
        });

        return {
          events,
          persons,
          organizations,
          websites,
          sources,
        };
      }),
    setRelations: (relations) => {
      const relationsMap = new Map<string, V1Relation>();
      relations.forEach((r) => {
        if (r.id) relationsMap.set(r.id, r);
      });
      set({ relations: relationsMap });
    },
    addRelations: (relations) =>
      set((state) => {
        const relationsMap = new Map(state.relations);
        relations.forEach((r) => {
          if (r.id) relationsMap.set(r.id, r);
        });
        return { relations: relationsMap };
      }),
  },
}));

export const useLocalDataActions = () => useLocalDataState((state) => state.actions);

export const useEntitiesRelations = () => {
  const { events, persons, organizations, websites, sources, relations } = useLocalDataState();
  return useMemo(
    () => ({
      events: Array.from(events.values()),
      persons: Array.from(persons.values()),
      organizations: Array.from(organizations.values()),
      websites: Array.from(websites.values()),
      sources: Array.from(sources.values()),
      relations: Array.from(relations.values()),
    }),
    [events, persons, organizations, websites, sources, relations],
  );
};

export const useEventRelatedEntities = (eventId?: string) => {
  const { persons, organizations, websites, sources, relations } = useLocalDataState();

  if (!eventId) {
    return {
      persons: [],
      organizations: [],
      websites: [],
      sources: [],
    };
  }

  const relatedRelations = Array.from(relations.values()).filter((r) => r.from === eventId);

  const result = {
    persons: [] as { entity: V1Person; relation: V1Relation }[],
    organizations: [] as { entity: V1Organization; relation: V1Relation }[],
    websites: [] as { entity: V1Website; relation: V1Relation }[],
    sources: [] as { entity: V1Source; relation: V1Relation }[],
  };

  relatedRelations.forEach((r) => {
    if (!r.to) return;

    if (persons.has(r.to)) {
      result.persons.push({ entity: persons.get(r.to)!, relation: r });
    } else if (organizations.has(r.to)) {
      result.organizations.push({ entity: organizations.get(r.to)!, relation: r });
    } else if (websites.has(r.to)) {
      result.websites.push({ entity: websites.get(r.to)!, relation: r });
    } else if (sources.has(r.to)) {
      result.sources.push({ entity: sources.get(r.to)!, relation: r });
    }
  });

  return result;
};

export const useFilteredEventsAndRelations = () => {
  const events = useLocalDataState((state) => state.events);
  const relations = useLocalDataState((state) => state.relations);

  const filteredRelations: V1Relation[] = [];
  for (const r of relations.values()) {
    if (r.from && events.has(r.from) && r.to && events.has(r.to)) {
      filteredRelations.push(r);
    }
  }

  return { events: Array.from(events.values()), relations: filteredRelations };
};
