
import React, { type PropsWithChildren, type CSSProperties } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { updateWebsite, updateWebsitePermissions, type Permissive } from 'omni-osint-crud-client';
import type { Entities, Website } from '../entity';
import { WebsiteForm } from '@omnsight/osint-entity-components/forms';

interface Props extends PropsWithChildren {
  entity: Website;
  isAdmin?: boolean;
  onUpdated?: (entities: Entities) => void;
  style?: CSSProperties;
}

export const WebsiteFormRenderer: React.FC<Props> = ({ entity, isAdmin, onUpdated, children, style }) => {
  const { t } = useTranslation();

  const handleUpdate = async (patch: Partial<Website>) => {
    if (!entity._id) {
      console.warn('Entity does not have an ID, cannot update');
      return;
    }
    console.log('Updating entity', 'Website', entity._id, patch);

    const entities: Entities = {};

    const { data: website, error: websiteError } = await updateWebsite({
      body: patch,
      path: {
        id: entity._id,
      },
    });
    if (websiteError) {
      notifications.show({
        title: t('common.error'),
        message: t('components.entity.FormRenderer.Website.updateError'),
        color: 'red',
      });
      return;
    } else {
      entities.websites = [website];
    }
    onUpdated?.(entities);
  };

  const handleUpdatePermissive = async (patch: Permissive) => {
    if (!entity._id) {
      console.warn('Entity does not have an ID, cannot update');
      return;
    }
    console.log('Updating entity permissively', 'Website', entity._id, patch);

    const entities: Entities = {};

    const { data, error } = await updateWebsitePermissions({
      body: patch,
      path: {
        id: entity._id,
      },
    });

    if (error) {
      console.error('Error updating website permissively', error);
      notifications.show({
        title: t('common.error'),
        message: t('components.entity.FormRenderer.Website.updatePermissionError'),
        color: 'red',
      });
      return;
    } else {
        entities.websites = [data];
    }
    onUpdated?.(entities);
  };

  return (
    <WebsiteForm
      website={entity}
      isAdmin={isAdmin}
      onUpdate={handleUpdate}
      onUpdatePermissive={handleUpdatePermissive}
      onClose={() => {}}
      style={style}
    >
      {children}
    </WebsiteForm>
  );
};
