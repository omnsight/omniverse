
import React, { type PropsWithChildren, type CSSProperties } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { updateOrganization, updateOrganizationPermissions, type Permissive } from 'omni-osint-crud-client';
import type { Entities, Organization } from '../entity';
import { OrganizationForm } from '@omnsight/osint-entity-components/forms';

interface Props extends PropsWithChildren {
  entity: Organization;
  isAdmin?: boolean;
  onUpdated?: (entities: Entities) => void;
  style?: CSSProperties;
}

export const OrganizationFormRenderer: React.FC<Props> = ({ entity, isAdmin, onUpdated, children, style }) => {
  const { t } = useTranslation();

  const handleUpdate = async (patch: Partial<Organization>) => {
    if (!entity._id) {
      console.warn('Entity does not have an ID, cannot update');
      return;
    }
    console.log('Updating entity', 'Organization', entity._id, patch);

    const entities: Entities = {};

    const { data: organization, error: organizationError } = await updateOrganization({
      body: patch,
      path: {
        id: entity._id,
      },
    });
    if (organizationError) {
      notifications.show({
        title: t('common.error'),
        message: t('components.entity.FormRenderer.Organization.updateError'),
        color: 'red',
      });
      return;
    } else {
      entities.organizations = [organization];
    }
    onUpdated?.(entities);
  };

  const handleUpdatePermissive = async (patch: Permissive) => {
    if (!entity._id) {
      console.warn('Entity does not have an ID, cannot update');
      return;
    }
    console.log('Updating entity permissively', 'Organization', entity._id, patch);

    const entities: Entities = {};

    const { data, error } = await updateOrganizationPermissions({
      body: patch,
      path: {
        id: entity._id,
      },
    });

    if (error) {
      console.error('Error updating organization permissively', error);
      notifications.show({
        title: t('common.error'),
        message: t('components.entity.FormRenderer.Organization.updatePermissionError'),
        color: 'red',
      });
      return;
    } else {
        entities.organizations = [data];
    }
    onUpdated?.(entities);
  };

  return (
    <OrganizationForm
      organization={entity}
      isAdmin={isAdmin}
      onUpdate={handleUpdate}
      onUpdatePermissive={handleUpdatePermissive}
      onClose={() => {}}
      style={style}
    >
      {children}
    </OrganizationForm>
  );
};
