import React from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { CreateService } from 'omni-osint-crud-client';
import type { Entities, Entity, EntityMainData } from './entity';
import { Button, Modal } from '@mantine/core';
import { EntityFormRenderer } from './FormRenderer';

interface Props {
  entity?: Entity;
  setEntity: (entity: Entity | undefined) => void;
  onCreated: (entities: Entities) => void;
}

export const EntityCreationModal: React.FC<Props> = ({ entity, setEntity, onCreated }) => {
  const { t } = useTranslation();

  const updateEntity = (data: EntityMainData) => {
    if (!entity) return;
    setEntity({
      ...entity,
      data: { ...entity.data, ...data },
    });
  };

  const createEntity = async () => {
    if (!entity) return;

    const entities: Entities = {};
    try {
      switch (entity.type) {
        case 'Event':
          const event = await CreateService.createEvent(entity.data);
          entities.events = [event];
          break;
        case 'Organization':
          const organization = await CreateService.createOrganization(entity.data);
          entities.organizations = [organization];
          break;
        case 'Person':
          const person = await CreateService.createPerson(entity.data);
          entities.people = [person];
          break;
        case 'Relation':
          const relation = await CreateService.createRelation(entity.data);
          entities.relations = [relation];
          break;
        case 'Source':
          const source = await CreateService.createSource(entity.data);
          entities.sources = [source];
          break;
        case 'Website':
          const website = await CreateService.createWebsite(entity.data);
          entities.websites = [website];
          break;
      }
      console.log('Created entities', entities);
      onCreated(entities);
    } catch (error) {
      notifications.show({
        title: t('common.error'),
        message: t('entity.create.error'),
        color: 'red',
      });
    }
  };

  if (!entity) {
    return null;
  }

  return (
    <Modal opened={!!entity} onClose={() => setEntity(undefined)} title={t('entity.create.title')}>
      <EntityFormRenderer entity={entity} onUpdate={updateEntity} />
      <Button onClick={createEntity}>{t('entity.create.submit')}</Button>
    </Modal>
  );
};
