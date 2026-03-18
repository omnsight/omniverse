import React from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { UpdateService } from 'omni-osint-crud-client';
import type { Entities, Entity, EntityMainData } from './entity';
import { EventForm, OrganizationForm, PersonForm, RelationForm, SourceForm, WebsiteForm } from '..';

interface Props {
  entity: Entity;
  onUpdated?: (entities: Entities) => void;
  onUpdate?: (data: EntityMainData) => void;
}

export const EntityFormRenderer: React.FC<Props> = ({ entity, onUpdated, onUpdate }) => {
  const { t } = useTranslation();

  const handleUpdate = async (data: EntityMainData) => {
    if (!entity.data._id) {
      console.warn('Entity does not have an ID, cannot update');
      return;
    }

    const entities: Entities = {};
    try {
      switch (entity.type) {
        case 'Event':
          const event = await UpdateService.updateEvent(entity.data._id, data);
          entities.events = [event];
          break;
        case 'Organization':
          const organization = await UpdateService.updateOrganization(entity.data._id, data);
          entities.organizations = [organization];
          break;
        case 'Person':
          const person = await UpdateService.updatePerson(entity.data._id, data);
          entities.people = [person];
          break;
        case 'Relation':
          const relation = await UpdateService.updateRelation(entity.data._id, data);
          entities.relations = [relation];
          break;
        case 'Source':
          const source = await UpdateService.updateSource(entity.data._id, data);
          entities.sources = [source];
          break;
        case 'Website':
          const website = await UpdateService.updateWebsite(entity.data._id, data);
          entities.websites = [website];
          break;
      }
      notifications.show({
        title: t('common.success'),
        message: t('entity.update.success'),
        color: 'green',
      });
      onUpdated?.(entities);
    } catch (error) {
      notifications.show({
        title: t('common.error'),
        message: t('entity.update.error'),
        color: 'red',
      });
    }
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
