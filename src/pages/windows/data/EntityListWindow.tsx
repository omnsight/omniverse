import React, { useState } from 'react';
import { Box, Button, ScrollArea, SimpleGrid, Stack, Title } from '@mantine/core';
import { useEntityDataStore } from '../network/entityData';
import { useEntitySelectionActions } from './entitySelection';
import { EventForm } from '../../../components/forms';
import { useTranslation } from 'react-i18next';
import { useWindowManager } from '../WindowManager';
import { PlusIcon } from '@heroicons/react/24/solid';
import { InputWindow } from '../../../components/modals/InputWindow';
import { createEvent, type Event, type EventMainData } from 'omni-osint-crud-client';
import { notifications } from '@mantine/notifications';
import { useCrudClient } from '../../../api/useCrudyClient';

interface CreationModalProps {
  event: Event | undefined;
  setEvent: (event: Event | undefined) => void;
}

const CreationModal: React.FC<CreationModalProps> = ({ event, setEvent }) => {
  const { t } = useTranslation();
  const { crudClient } = useCrudClient();
  const { actions } = useEntityDataStore();

  const updateEvent = (data: EventMainData) => {
    if (!event) return;
    setEvent({
      ...event,
      ...data,
    });
  };

  const submitNewEvent = async () => {
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
      setEvent(undefined);
      console.log('Created event', data);
    }
  };

  if (event) {
    return (
      <InputWindow
        title={t('pages.windows.data.EntityListWindow.createEventTitle')}
        cancel={t('common.cancel')}
        submit={t('common.create')}
        onClose={() => setEvent(undefined)}
        onSubmit={submitNewEvent}
      >
        <EventForm event={event} useLabel={true} useInput={true} onUpdate={updateEvent} />
      </InputWindow>
    );
  } else {
    return (
      <Button fullWidth onClick={() => setEvent({})}>
        <PlusIcon style={{ width: 20, height: 20 }} />
      </Button>
    );
  }
};

export const EntityListWindowContent: React.FC = () => {
  const { events } = useEntityDataStore();
  const { setActiveWindowByName } = useWindowManager();
  const { setSelections } = useEntitySelectionActions();
  const { authed } = useCrudClient();
  const [eventToCreate, setEventToCreate] = useState<Event | undefined>(undefined);

  return (
    <Box pos="relative" h="100%" w="100%">
      <ScrollArea h="100%" w="100%" type="scroll" offsetScrollbars>
        <Box p="lg">
          <Stack>
            {events.map((entity) => (
              <Box key={entity._id}>
                <EventForm
                  event={entity}
                  useLabel={false}
                  useInput={false}
                  onClick={() => {
                    setSelections([entity._id || '']);
                    setActiveWindowByName('Entity');
                  }}
                />
              </Box>
            ))}
            {authed && <CreationModal event={eventToCreate} setEvent={setEventToCreate} />}
          </Stack>
        </Box>
      </ScrollArea>
    </Box>
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
