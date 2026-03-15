import React from 'react';
import { EventForm, OrganizationForm, PersonForm, RelationForm, SourceForm, WebsiteForm } from '.';
import type { Entity } from '../models/entity';
import type {
  EventMainData,
  OrganizationMainData,
  PersonMainData,
  RelationMainData,
  SourceMainData,
  WebsiteMainData,
} from 'omni-osint-crud-client';

interface Props {
  entity: Entity;
  onUpdate?: (
    data:
      | EventMainData
      | OrganizationMainData
      | PersonMainData
      | RelationMainData
      | SourceMainData
      | WebsiteMainData,
  ) => void;
}

export const EntityFormRenderer: React.FC<Props> = ({ entity, onUpdate }) => {
  switch (entity.type) {
    case 'Event':
      return <EventForm event={entity.data} onUpdate={onUpdate} />;
    case 'Organization':
      return <OrganizationForm organization={entity.data} onUpdate={onUpdate} />;
    case 'Person':
      return <PersonForm person={entity.data} onUpdate={onUpdate} />;
    case 'Relation':
      return <RelationForm relation={entity.data} onUpdate={onUpdate} />;
    case 'Source':
      return <SourceForm source={entity.data} onUpdate={onUpdate} />;
    case 'Website':
      return <WebsiteForm website={entity.data} onUpdate={onUpdate} />;
    default:
      return null;
  }
};
