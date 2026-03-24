import React, { useState } from 'react';
import { Box, Button, ScrollArea, Stack, Title } from '@mantine/core';
import { useEntityDataStore } from '../network/entityData';
import { useEntitySelectionActions } from './entitySelection';
import { EventForm } from '../../../components/forms';
import { useTranslation } from 'react-i18next';
import { useWindowManager } from '../WindowManager';
import { PlusIcon } from '@heroicons/react/24/solid';
import { createEvent, type Event } from 'omni-osint-crud-client';
import { notifications } from '@mantine/notifications';
import { useCrudClient } from '../../../api/useCrudyClient';

export const EntityListWindowContent: React.FC = () => {
  const { t } = useTranslation();
  const { events, actions } = useEntityDataStore();
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
      actions.addEntities({ events: [data] });
      setCreating(false);
      console.log('Created event', data);
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
                onClick={() => {
                  setSelections([entity._id || '']);
                  setActiveWindowByName('Entity');
                }}
                onClose={() => {}}
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
