
import React, { type PropsWithChildren, type CSSProperties } from 'react';
import type { Entities, Entity } from '../entity';
import { EventFormRenderer } from './Event';
import { OrganizationFormRenderer } from './Organization';
import { PersonFormRenderer } from './Person';
import { RelationFormRenderer } from './Relation';
import { SourceFormRenderer } from './Source';
import { WebsiteFormRenderer } from './Website';

interface Props extends PropsWithChildren {
  entity: Entity;
  neighbors?: Entities;
  isAdmin?: boolean;
  onUpdated?: (entities: Entities) => void;
  style?: CSSProperties;
}

export const EntityFormRenderer: React.FC<Props> = ({
  entity,
  neighbors,
  isAdmin,
  onUpdated,
  children,
  style,
}) => {
  switch (entity.type) {
    case 'Event':
      return (
        <EventFormRenderer
          entity={entity.data}
          neighbors={neighbors}
          isAdmin={isAdmin}
          onUpdated={onUpdated}
          style={style}
        >
          {children}
        </EventFormRenderer>
      );
    case 'Organization':
      return (
        <OrganizationFormRenderer entity={entity.data} isAdmin={isAdmin} onUpdated={onUpdated} style={style}>
          {children}
        </OrganizationFormRenderer>
      );
    case 'Person':
      return (
        <PersonFormRenderer entity={entity.data} isAdmin={isAdmin} onUpdated={onUpdated} style={style}>
          {children}
        </PersonFormRenderer>
      );
    case 'Relation':
      return (
        <RelationFormRenderer entity={entity.data} isAdmin={isAdmin} onUpdated={onUpdated} style={style}>
          {children}
        </RelationFormRenderer>
      );
    case 'Source':
      return (
        <SourceFormRenderer entity={entity.data} isAdmin={isAdmin} onUpdated={onUpdated} style={style}>
          {children}
        </SourceFormRenderer>
      );
    case 'Website':
      return (
        <WebsiteFormRenderer entity={entity.data} isAdmin={isAdmin} onUpdated={onUpdated} style={style}>
          {children}
        </WebsiteFormRenderer>
      );
    default:
      return null;
  }
};
