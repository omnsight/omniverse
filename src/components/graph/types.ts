import type {
  V1Event,
  V1Person,
  V1Organization,
  V1Website,
  V1Source,
} from '@omnsight/clients/dist/omndapi/omndapi.js';
import { EventNode } from '../entity/event/Node';
import { PersonNode } from '../entity/person/Node';
import { OrganizationNode } from '../entity/organization/Node';
import { WebsiteNode } from '../entity/website/Node';
import { SourceNode } from '../entity/source/Node';
import { RelationEdge } from '../entity/relation/Edge';

export type EntityTypeLabel = 'event' | 'person' | 'organization' | 'website' | 'source';
export type EntityType = V1Event | V1Person | V1Organization | V1Website | V1Source;
export type GraphMode = 'graph' | 'compare';

export const NodeTypes = {
  event: EventNode,
  person: PersonNode,
  organization: OrganizationNode,
  website: WebsiteNode,
  source: SourceNode,
};

export const EdgeTypes = {
  relation: RelationEdge,
};

export interface EntityData {
  label: string;
  details: EntityType;
}
