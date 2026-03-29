
import React, { type PropsWithChildren, type CSSProperties } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { updateRelation, updateRelationPermissions, type Permissive } from 'omni-osint-crud-client';
import type { Entities, Relation } from '../entity';
import { RelationForm } from '@omnsight/osint-entity-components/forms';

interface Props extends PropsWithChildren {
  entity: Relation;
  isAdmin?: boolean;
  onUpdated?: (entities: Entities) => void;
  style?: CSSProperties;
}

export const RelationFormRenderer: React.FC<Props> = ({ entity, isAdmin, onUpdated, children, style }) => {
  const { t } = useTranslation();

  const handleUpdate = async (patch: Partial<Relation>) => {
    if (!entity._id) {
      console.warn('Entity does not have an ID, cannot update');
      return;
    }
    console.log('Updating entity', 'Relation', entity._id, patch);

    const entities: Entities = {};

    const { data: relation, error: relationError } = await updateRelation({
      body: patch,
      path: {
        id: entity._id,
      },
    });
    if (relationError) {
      notifications.show({
        title: t('common.error'),
        message: t('components.entity.FormRenderer.Relation.updateError'),
        color: 'red',
      });
      return;
    } else {
      entities.relations = [relation];
    }
    onUpdated?.(entities);
  };

  const handleUpdatePermissive = async (patch: Permissive) => {
    if (!entity._id) {
      console.warn('Entity does not have an ID, cannot update');
      return;
    }
    console.log('Updating entity permissively', 'Relation', entity._id, patch);

    const entities: Entities = {};

    const { data, error } = await updateRelationPermissions({
      body: patch,
      path: {
        id: entity._id,
      },
    });

    if (error) {
      console.error('Error updating relation permissively', error);
      notifications.show({
        title: t('common.error'),
        message: t('components.entity.FormRenderer.Relation.updatePermissionError'),
        color: 'red',
      });
      return;
    } else {
        entities.relations = [data];
    }
    onUpdated?.(entities);
  };

  return (
    <RelationForm
      relation={entity}
      isAdmin={isAdmin}
      onUpdate={handleUpdate}
      onUpdatePermissive={handleUpdatePermissive}
      onClose={() => {}}
      style={style}
    >
      {children}
    </RelationForm>
  );
};
