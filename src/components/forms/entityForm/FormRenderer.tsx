import React from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import {
  updateEvent,
  updateOrganization,
  updatePerson,
  updateRelation,
  updateSource,
  updateWebsite,
} from 'omni-osint-crud-client';
import type { Entities, Entity, EntityMainData } from './entity';
import { EventForm, OrganizationForm, PersonForm, RelationForm, SourceForm, WebsiteForm } from '..';

interface Props {
  entity: Entity;
  onUpdated?: (entities: Entities) => void;
  onUpdate?: (data: EntityMainData) => void;
}

export const EntityFormRenderer: React.FC<Props> = ({ entity, onUpdated, onUpdate }) => {
  const { t } = useTranslation();

  const handleUpdate = async (patch: EntityMainData) => {
    if (!entity.data._id) {
      console.warn('Entity does not have an ID, cannot update');
      return;
    }

    const entities: Entities = {};

    switch (entity.type) {
      case 'Event':
        const { data, error } = await updateEvent({
          body: patch,
          path: {
            id: entity.data._id,
          },
        });
        if (error) {
          notifications.show({
            title: t('common.error'),
            message: t('entity.update.error'),
            color: 'red',
          });
          return;
        } else {
          entities.events = [data];
        }
        break;
      case 'Organization':
        const { data: organization, error: organizationError } = await updateOrganization({
          body: patch,
          path: {
            id: entity.data._id,
          },
        });
        if (organizationError) {
          notifications.show({
            title: t('common.error'),
            message: t('entity.update.error'),
            color: 'red',
          });
          return;
        } else {
          entities.organizations = [organization];
        }
        break;
      case 'Person':
        const { data: person, error: personError } = await updatePerson({
          body: patch,
          path: {
            id: entity.data._id,
          },
        });
        if (personError) {
          notifications.show({
            title: t('common.error'),
            message: t('entity.update.error'),
            color: 'red',
          });
          return;
        } else {
          entities.people = [person];
        }
        break;
      case 'Relation':
        const { data: relation, error: relationError } = await updateRelation({
          body: patch,
          path: {
            id: entity.data._id,
          },
        });
        if (relationError) {
          notifications.show({
            title: t('common.error'),
            message: t('entity.update.error'),
            color: 'red',
          });
          return;
        } else {
          entities.relations = [relation];
        }
        break;
      case 'Source':
        const { data: source, error: sourceError } = await updateSource({
          body: patch,
          path: {
            id: entity.data._id,
          },
        });
        if (sourceError) {
          notifications.show({
            title: t('common.error'),
            message: t('entity.update.error'),
            color: 'red',
          });
          return;
        } else {
          entities.sources = [source];
        }
        break;
      case 'Website':
        const { data: website, error: websiteError } = await updateWebsite({
          body: patch,
          path: {
            id: entity.data._id,
          },
        });
        if (websiteError) {
          notifications.show({
            title: t('common.error'),
            message: t('entity.update.error'),
            color: 'red',
          });
          return;
        } else {
          entities.websites = [website];
        }
        break;
    }
    onUpdated?.(entities);
  };

  switch (entity.type) {
    case 'Event':
      return <EventForm event={entity.data} onUpdate={onUpdated ? handleUpdate : onUpdate} />;
    case 'Organization':
      return (
        <OrganizationForm
          organization={entity.data}
          onUpdate={onUpdated ? handleUpdate : onUpdate}
        />
      );
    case 'Person':
      return <PersonForm person={entity.data} onUpdate={onUpdated ? handleUpdate : onUpdate} />;
    case 'Relation':
      return <RelationForm relation={entity.data} onUpdate={onUpdated ? handleUpdate : onUpdate} />;
    case 'Source':
      return <SourceForm source={entity.data} onUpdate={onUpdated ? handleUpdate : onUpdate} />;
    case 'Website':
      return <WebsiteForm website={entity.data} onUpdate={onUpdated ? handleUpdate : onUpdate} />;
    default:
      return null;
  }
};
