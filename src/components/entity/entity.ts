import type {
  Event,
  Organization,
  Person,
  Source,
  Website,
  Relation,
  EventMainData,
  OrganizationMainData,
  PersonMainData,
  RelationMainData,
  SourceMainData,
  WebsiteMainData,
} from 'omni-osint-crud-client';

export type { Event, Organization, Person, Source, Website, Relation };

export type EntityMainData =
  | EventMainData
  | OrganizationMainData
  | PersonMainData
  | RelationMainData
  | SourceMainData
  | WebsiteMainData;

export type Entity =
  | {
      type: 'Event';
      data: Event;
    }
  | {
      type: 'Organization';
      data: Organization;
    }
  | {
      type: 'Person';
      data: Person;
    }
  | {
      type: 'Source';
      data: Source;
    }
  | {
      type: 'Website';
      data: Website;
    }
  | {
      type: 'Relation';
      data: Relation;
    };

export interface Entities {
  events?: Event[];
  organizations?: Organization[];
  people?: Person[];
  sources?: Source[];
  websites?: Website[];
  relations?: Relation[];
}

export const getEntityTitle = (entity: Entity): string => {
  switch (entity.type) {
    case 'Event':
      return entity.data.title || '';
    case 'Organization':
      return entity.data.name || '';
    case 'Person':
      return entity.data.name || '';
    case 'Source':
      return entity.data.title || entity.data.name || '';
    case 'Website':
      return entity.data.title || '';
    case 'Relation':
      return entity.data.label || entity.data.name || '';
    default:
      return 'Unknown';
  }
};

export const transformEntities = (entities: Entities): Entity[] => {
  const result: Entity[] = [];
  if (entities.events) {
    entities.events.forEach((e: Event) => result.push({ type: 'Event', data: e }));
  }
  if (entities.organizations) {
    entities.organizations.forEach((o: Organization) =>
      result.push({ type: 'Organization', data: o }),
    );
  }
  if (entities.people) {
    entities.people.forEach((p: Person) => result.push({ type: 'Person', data: p }));
  }
  if (entities.relations) {
    entities.relations.forEach((r: Relation) => result.push({ type: 'Relation', data: r }));
  }
  if (entities.sources) {
    entities.sources.forEach((s: Source) => result.push({ type: 'Source', data: s }));
  }
  if (entities.websites) {
    entities.websites.forEach((w: Website) => result.push({ type: 'Website', data: w }));
  }
  return result;
};
