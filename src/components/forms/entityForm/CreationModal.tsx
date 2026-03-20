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
import { EntityFormRenderer } from './FormRenderer';
import { WindowModal } from '../../modals/WindowModal';

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
    switch (entity.type) {
      case 'Event':
        const { data, error } = await createEvent({ body: entity.data });
        if (error) {
          notifications.show({
            title: t('common.error'),
            message: t('components.forms.entityForm.CreationModal.error'),
            color: 'red',
          });
        } else {
          entities.events = [data];
        }
        break;
      case 'Organization':
        const { data: organization, error: organizationError } = await createOrganization({
          body: entity.data,
        });
        if (organizationError) {
          notifications.show({
            title: t('common.error'),
            message: t('components.forms.entityForm.CreationModal.error'),
            color: 'red',
          });
        } else {
          entities.organizations = [organization];
        }
        break;
      case 'Person':
        const { data: person, error: personError } = await createPerson({
          body: entity.data,
        });
        if (personError) {
          notifications.show({
            title: t('common.error'),
            message: t('components.forms.entityForm.CreationModal.error'),
            color: 'red',
          });
        } else {
          entities.people = [person];
        }
        break;
      case 'Relation':
        const { data: relation, error: relationError } = await createRelation({
          body: entity.data,
        });
        if (relationError) {
          notifications.show({
            title: t('common.error'),
            message: t('components.forms.entityForm.CreationModal.error'),
            color: 'red',
          });
        } else {
          entities.relations = [relation];
        }
        break;
      case 'Source':
        const { data: source, error: sourceError } = await createSource({
          body: entity.data,
        });
        if (sourceError) {
          notifications.show({
            title: t('common.error'),
            message: t('components.forms.entityForm.CreationModal.error'),
            color: 'red',
          });
        } else {
          entities.sources = [source];
        }
        break;
      case 'Website':
        const { data: website, error: websiteError } = await createWebsite({
          body: entity.data,
        });
        if (websiteError) {
          notifications.show({
            title: t('common.error'),
            message: t('components.forms.entityForm.CreationModal.error'),
            color: 'red',
          });
        } else {
          entities.websites = [website];
        }
        break;
    }
    onCreated(entities);
  };

  if (!entity) {
    return null;
  }

  return (
    <WindowModal
      title={t('components.forms.entityForm.CreationModal.title')}
      submit={t('components.forms.entityForm.CreationModal.submit')}
      onClose={() => setEntity(undefined)}
      onSubmit={createEntity}
    >
      <EntityFormRenderer entity={entity} onUpdate={updateEntity} />
    </WindowModal>
  );
};
