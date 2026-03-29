
import React, { type PropsWithChildren, type CSSProperties } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { updateSource, updateSourcePermissions, type Permissive } from 'omni-osint-crud-client';
import type { Entities, Source } from '../entity';
import { SourceForm } from '@omnsight/osint-entity-components/forms';

interface Props extends PropsWithChildren {
  entity: Source;
  isAdmin?: boolean;
  onUpdated?: (entities: Entities) => void;
  style?: CSSProperties;
}

export const SourceFormRenderer: React.FC<Props> = ({ entity, isAdmin, onUpdated, children, style }) => {
  const { t } = useTranslation();

  const handleUpdate = async (patch: Partial<Source>) => {
    if (!entity._id) {
      console.warn('Entity does not have an ID, cannot update');
      return;
    }
    console.log('Updating entity', 'Source', entity._id, patch);

    const entities: Entities = {};

    const { data: source, error: sourceError } = await updateSource({
      body: patch,
      path: {
        id: entity._id,
      },
    });
    if (sourceError) {
      notifications.show({
        title: t('common.error'),
        message: t('components.entity.FormRenderer.Source.updateError'),
        color: 'red',
      });
      return;
    } else {
      entities.sources = [source];
    }
    onUpdated?.(entities);
  };

  const handleUpdatePermissive = async (patch: Permissive) => {
    if (!entity._id) {
      console.warn('Entity does not have an ID, cannot update');
      return;
    }
    console.log('Updating entity permissively', 'Source', entity._id, patch);

    const entities: Entities = {};

    const { data, error } = await updateSourcePermissions({
      body: patch,
      path: {
        id: entity._id,
      },
    });

    if (error) {
      console.error('Error updating source permissively', error);
      notifications.show({
        title: t('common.error'),
        message: t('components.entity.FormRenderer.Source.updatePermissionError'),
        color: 'red',
      });
      return;
    } else {
        entities.sources = [data];
    }
    onUpdated?.(entities);
  };

  return (
    <SourceForm
      source={entity}
      isAdmin={isAdmin}
      onUpdate={handleUpdate}
      onUpdatePermissive={handleUpdatePermissive}
      onClose={() => {}}
      style={style}
    >
      {children}
    </SourceForm>
  );
};
