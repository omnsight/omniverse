
import React, { type PropsWithChildren, type CSSProperties } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { updateEvent, updateEventPermissions, type Permissive } from 'omni-osint-crud-client';
import type { Entities, Event } from '../entity';
import { EventForm } from '@omnsight/osint-entity-components/forms';

interface Props extends PropsWithChildren {
  entity: Event;
  neighbors?: Entities;
  isAdmin?: boolean;
  onUpdated?: (entities: Entities) => void;
  style?: CSSProperties;
}

export const EventFormRenderer: React.FC<Props> = ({
  entity,
  neighbors,
  isAdmin,
  onUpdated,
  children,
  style,
}) => {
  const { t } = useTranslation();

  const handleUpdate = async (patch: Partial<Event>) => {
    if (!entity._id) {
      console.warn('Entity does not have an ID, cannot update');
      return;
    }
    console.log('Updating entity', 'Event', entity._id, patch);

    const entities: Entities = {};

    const { data, error } = await updateEvent({
      body: patch,
      path: {
        id: entity._id,
      },
    });
    if (error) {
      console.error('Error updating event', error);
      notifications.show({
        title: t('common.error'),
        message: t('components.entity.FormRenderer.Event.updateError'),
        color: 'red',
      });
      return;
    } else {
      entities.events = [data];
    }
    onUpdated?.(entities);
  };

  const handleUpdatePermissive = async (patch: Permissive) => {
    if (!entity._id) {
      console.warn('Entity does not have an ID, cannot update');
      return;
    }
    console.log('Updating entity permissively', 'Event', entity._id, patch);

    const entities: Entities = {};

    const { data, error } = await updateEventPermissions({
      body: patch,
      path: {
        id: entity._id,
      },
    });

    if (error) {
      console.error('Error updating event permissively', error);
      notifications.show({
        title: t('common.error'),
        message: t('components.entity.FormRenderer.Event.updatePermissionError'),
        color: 'red',
      });
      return;
    } else {
        entities.events = [data];
    }
    onUpdated?.(entities);
  };

  return (
    <EventForm
      event={entity}
      sources={neighbors?.sources}
      isAdmin={isAdmin}
      onUpdate={handleUpdate}
      onUpdatePermissive={handleUpdatePermissive}
      onClose={() => {}}
      style={style}
    >
      {children}
    </EventForm>
  );
};
