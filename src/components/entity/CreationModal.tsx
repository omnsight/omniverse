import { Modal, ScrollArea } from '@mantine/core';
import React from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import {
  createEvent,
  createOrganization,
  createPerson,
  createRelation,
  createSource,
  createWebsite,
} from 'omni-osint-crud-client';
import type { Entities, Entity, EntityMainData } from './entity';
import {
  EventForm,
  OrganizationForm,
  PersonForm,
  RelationForm,
  SourceForm,
  WebsiteForm,
} from '../forms';

interface Props {
  entity?: Entity;
  setEntity: (entity: Entity | undefined) => void;
  onCreated: (entities: Entities) => void;
}

export const EntityCreationModal: React.FC<Props> = ({ entity, setEntity, onCreated }) => {
  const { t } = useTranslation();

  const createEntity = async (data: EntityMainData) => {
    if (!entity) return;

    const entities: Entities = {};
    switch (entity.type) {
      case 'Event':
        const { data: event, error } = await createEvent({ body: data });
        if (error) {
          notifications.show({
            title: t('common.error'),
            message: t('components.entity.CreationModal.error', '?'),
            color: 'red',
          });
        } else {
          entities.events = [event];
        }
        break;
      case 'Organization':
        const { data: organization, error: organizationError } = await createOrganization({
          body: data,
        });
        if (organizationError) {
          notifications.show({
            title: t('common.error'),
            message: t('components.entity.CreationModal.error', '?'),
            color: 'red',
          });
        } else {
          entities.organizations = [organization];
        }
        break;
      case 'Person':
        const { data: person, error: personError } = await createPerson({ body: data });
        if (personError) {
          notifications.show({
            title: t('common.error'),
            message: t('components.entity.CreationModal.error', '?'),
            color: 'red',
          });
        } else {
          entities.people = [person];
        }
        break;
      case 'Relation':
        const { data: relation, error: relationError } = await createRelation({
          body: data,
        });
        if (relationError) {
          notifications.show({
            title: t('common.error'),
            message: t('components.entity.CreationModal.error', '?'),
            color: 'red',
          });
        } else {
          entities.relations = [relation];
        }
        break;
      case 'Source':
        const { data: source, error: sourceError } = await createSource({ body: data });
        if (sourceError) {
          notifications.show({
            title: t('common.error'),
            message: t('components.entity.CreationModal.error', '?'),
            color: 'red',
          });
        } else {
          entities.sources = [source];
        }
        break;
      case 'Website':
        const { data: website, error: websiteError } = await createWebsite({
          body: data,
        });
        if (websiteError) {
          notifications.show({
            title: t('common.error'),
            message: t('components.entity.CreationModal.error', '?'),
            color: 'red',
          });
        } else {
          entities.websites = [website];
        }
        break;
    }
    onCreated(entities);
    setEntity(undefined);
  };

  const renderForm = () => {
    if (!entity) {
      return null;
    }
    switch (entity.type) {
      case 'Event':
        return (
          <EventForm
            event={entity.data}
            onSubmit={createEntity}
            useInput={true}
            onClose={() => setEntity(undefined)}
          />
        );
      case 'Organization':
        return (
          <OrganizationForm
            organization={entity.data}
            onSubmit={createEntity}
            useInput={true}
            onClose={() => setEntity(undefined)}
          />
        );
      case 'Person':
        return (
          <PersonForm
            person={entity.data}
            onSubmit={createEntity}
            useInput={true}
            onClose={() => setEntity(undefined)}
          />
        );
      case 'Relation':
        return (
          <RelationForm
            relation={entity.data}
            onSubmit={createEntity}
            useInput={true}
            onClose={() => setEntity(undefined)}
          />
        );
      case 'Source':
        return (
          <SourceForm
            source={entity.data}
            onSubmit={createEntity}
            useInput={true}
            onClose={() => setEntity(undefined)}
          />
        );
      case 'Website':
        return (
          <WebsiteForm
            website={entity.data}
            onSubmit={createEntity}
            useInput={true}
            onClose={() => setEntity(undefined)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      opened={!!entity}
      onClose={() => setEntity(undefined)}
      title={
        entity?.type ? t('common.create') + t(`common.entity.${entity.type}`) : t('common.create')
      }
      centered
    >
      <ScrollArea.Autosize mah="40vh">{renderForm()}</ScrollArea.Autosize>
    </Modal>
  );
};
