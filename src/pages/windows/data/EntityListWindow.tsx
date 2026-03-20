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

export const EntityListWindowContent: React.FC = () => {
  const { t } = useTranslation();
  const { events, actions } = useEntityDataStore();
  const { setActiveWindowByName } = useWindowManager();
  const { setSelections } = useEntitySelectionActions();
  const [eventToCreate, setEventToCreate] = useState<Event | undefined>(undefined);

  const updateEvent = (data: EventMainData) => {
    if (!eventToCreate) return;
    setEventToCreate({
      ...eventToCreate,
      ...data,
    });
  };

  const submitNewEvent = async () => {
    if (!eventToCreate) return;
    const { data, error, status } = await createEvent({
      body: eventToCreate,
    });

    if (error) {
      console.error(`Error [${status}] creating event`, error);
      notifications.show({
        title: t('common.error'),
        message: t('insight.create.error'),
        color: 'red',
      });
    } else {
      actions.addEntities({ events: [data] });
      setEventToCreate(undefined);
      console.log('Created event', data);
    }
  };

  return (
    <Box pos="relative" h="100%" w="100%">
      <ScrollArea h="100%" w="100%" type="scroll" offsetScrollbars>
        <Box p="lg">
          <Stack>
            <SimpleGrid cols={3} spacing="xl">
              {events.map((entity) => (
                <Box key={entity._id}>
                  <EventForm
                    event={entity}
                    onClick={() => {
                      setSelections([entity._id || '']);
                      setActiveWindowByName('Entity');
                    }}
                  />
                </Box>
              ))}
            </SimpleGrid>
            {eventToCreate ? (
              <InputWindow
                title={t('insight.create.title')}
                cancel={t('common.cancel')}
                submit={t('common.create')}
                onClose={() => setEventToCreate(undefined)}
                onSubmit={submitNewEvent}
              >
                <EventForm event={eventToCreate} onUpdate={updateEvent} />
              </InputWindow>
            ) : (
              <Button
                fullWidth
                leftSection={<PlusIcon style={{ width: 20, height: 20 }} />}
                onClick={() => setEventToCreate({})}
              >
                {t('insight.list.create.new')}
              </Button>
            )}
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
        <Title order={3}>{t('data.entity.list.title')}</Title>
      </Box>
      <EntityListWindowContent />
    </Box>
  );
};
