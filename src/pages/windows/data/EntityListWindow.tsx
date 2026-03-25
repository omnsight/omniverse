import React, { useState } from 'react';
import { ActionIcon, Box, Button, ScrollArea, Stack, Title } from '@mantine/core';
import { useEntityDataActions, useEntityDataStore } from '../network/entityData';
import { useEntitySelectionActions } from './entitySelection';
import { EventForm } from '../../../components/forms';
import { useTranslation } from 'react-i18next';
import { useWindowManager } from '../WindowManager';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/solid';
import { createEvent, updateEvent, type Event } from 'omni-osint-crud-client';
import { notifications } from '@mantine/notifications';
import { useCrudClient } from '../../../api/useCrudyClient';
import { canWriteToEntity, useAuth } from '../../../provider/AuthContext';

export const EntityListWindowContent: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { events } = useEntityDataStore();
  const { addEntities } = useEntityDataActions();
  const { setActiveWindowByName } = useWindowManager();
  const { setSelections } = useEntitySelectionActions();
  const { authed, crudClient } = useCrudClient();
  const [creating, setCreating] = useState(false);

  const submitNewEvent = async (event: Event) => {
    if (!event) return;
    const { data, error, status } = await createEvent({
      body: event,
      client: crudClient,
    });

    if (error) {
      console.error(`Error [${status}] creating event`, error);
      notifications.show({
        title: t('common.error'),
        message: t('pages.windows.data.EntityListWindow.error'),
        color: 'red',
      });
    } else {
      addEntities({ events: [data] });
      setCreating(false);
      console.log('Created event', data);
    }
  };

  const handleUpdateEvent = async (id: string, patch: Partial<Event>) => {
    console.debug('Updating event', id, patch);
    const { data, error, status } = await updateEvent({
      body: patch,
      path: {
        id,
      },
      client: crudClient,
    });

    if (error) {
      console.error(`Error [${status}] updating event`, error);
      notifications.show({
        title: t('common.error'),
        message: t('pages.windows.data.EntityListWindow.error'),
        color: 'red',
      });
    } else {
      addEntities({ events: [data] });
      console.log('Updated event', data);
    }
  };

  return (
    <ScrollArea h="100%" w="100%" type="scroll" offsetScrollbars>
      <Box p="lg" pt="sm">
        <Stack>
          {events.map((entity) => (
            <Box key={entity._id}>
              <EventForm
                event={entity}
                useInput={false}
                onUpdate={
                  canWriteToEntity(user, entity).canEdit
                    ? (data) => data._id && handleUpdateEvent(data._id, data)
                    : undefined
                }
                onClose={() => {}}
                exitButton={
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (entity._id) {
                        setSelections([entity._id]);
                        setActiveWindowByName('Entity');
                      }
                    }}
                  >
                    <ArrowRightIcon style={{ width: 18, height: 18 }} />
                  </ActionIcon>
                }
              />
            </Box>
          ))}
          {authed &&
            (creating ? (
              <EventForm
                event={{}}
                useInput={true}
                onSubmit={submitNewEvent}
                onClose={() => setCreating(false)}
              />
            ) : (
              <Button fullWidth onClick={() => setCreating(true)}>
                <PlusIcon style={{ width: 20, height: 20 }} />
              </Button>
            ))}
        </Stack>
      </Box>
    </ScrollArea>
  );
};

export const EntityListWindow: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box pos="relative" h="100%" w="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Box p="lg" pb={0}>
        <Title order={3}>{t('pages.windows.data.EntityListWindow.title')}</Title>
      </Box>
      <EntityListWindowContent />
    </Box>
  );
};
