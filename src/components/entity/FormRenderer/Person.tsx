
import React, { type PropsWithChildren, type CSSProperties } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { updatePerson, updatePersonPermissions, type Permissive } from 'omni-osint-crud-client';
import type { Entities, Person } from '../entity';
import { PersonForm } from '@omnsight/osint-entity-components/forms';

interface Props extends PropsWithChildren {
  entity: Person;
  isAdmin?: boolean;
  onUpdated?: (entities: Entities) => void;
  style?: CSSProperties;
}

export const PersonFormRenderer: React.FC<Props> = ({ entity, isAdmin, onUpdated, children, style }) => {
  const { t } = useTranslation();

  const handleUpdate = async (patch: Partial<Person>) => {
    if (!entity._id) {
      console.warn('Entity does not have an ID, cannot update');
      return;
    }
    console.log('Updating entity', 'Person', entity._id, patch);

    const entities: Entities = {};

    const { data: person, error: personError } = await updatePerson({
      body: patch,
      path: {
        id: entity._id,
      },
    });
    if (personError) {
      notifications.show({
        title: t('common.error'),
        message: t('components.entity.FormRenderer.Person.updateError'),
        color: 'red',
      });
      return;
    } else {
      entities.people = [person];
    }
    onUpdated?.(entities);
  };

  const handleUpdatePermissive = async (patch: Permissive) => {
    if (!entity._id) {
      console.warn('Entity does not have an ID, cannot update');
      return;
    }
    console.log('Updating entity permissively', 'Person', entity._id, patch);

    const entities: Entities = {};

    const { data, error } = await updatePersonPermissions({
      body: patch,
      path: {
        id: entity._id,
      },
    });

    if (error) {
      console.error('Error updating person permissively', error);
      notifications.show({
        title: t('common.error'),
        message: t('components.entity.FormRenderer.Person.updatePermissionError'),
        color: 'red',
      });
      return;
    } else {
        entities.people = [data];
    }
    onUpdated?.(entities);
  };

  return (
    <PersonForm
      person={entity}
      isAdmin={isAdmin}
      onUpdate={handleUpdate}
      onUpdatePermissive={handleUpdatePermissive}
      onClose={() => {}}
      style={style}
    >
      {children}
    </PersonForm>
  );
};
