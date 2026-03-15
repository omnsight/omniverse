import type {
  Event,
  Organization,
  Person,
  Source,
  Website,
  Relation,
} from 'omni-osint-crud-client';

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
