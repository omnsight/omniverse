import React, { useState, useEffect } from 'react';
import { Box, ScrollArea, Text, Paper, Loader, Center, Switch, Group, rem, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/24/solid';
import { EventMap } from '../components/osint/EventMap';
import { EventEntity } from '../components/osint/entities/EventEntity';
import type { V1Event } from '@omnsight/clients/dist/geovision/geovision.js';
import { useAuth } from '../utilties/AuthProvider';
import { useGlobalSearch, useInvalidateGlobalSearch } from '../utilties/useGlobalSearchResult';
import { useBaseApi } from '../utilties/useBaseApi';

export const DataPlane: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useGlobalSearch();
  const invalidateGlobalSearch = useInvalidateGlobalSearch();
  const { events = [], relations = [] } = data?.data || {};
  const { hasRole, isLoading } = useAuth();
  const baseApi = useBaseApi();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<V1Event | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasRole('admin')) {
      navigate('/error', {
        state: {
          title: t('errorPage.defaultTitle'),
          description: t('dataPlane.accessDeniedDescription')
        },
        replace: true
      });
    }
  }, [hasRole, isLoading, navigate, t]);

  if (isLoading || !hasRole('admin')) {
    return (
      <Center h="100%">
        <Loader size="lg" />
      </Center>
    );
  }

  const handleEventSelect = (event: V1Event | undefined) => {
    if (isEditMode && selectedEvent?.key === event?.key) {
      return;
    }

    setSelectedEvent(event);

    if (event) {
      const element = document.getElementById(`event-item-${event.key}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleUpdateEvent = async (updates: Partial<V1Event>) => {
    if (selectedEvent) {
      await baseApi.v1.eventServiceUpdateEvent(selectedEvent.key!, updates);
      invalidateGlobalSearch();
    }
  };

  const handleCreateEvent = async (event: V1Event) => {
    await baseApi.v1.eventServiceCreateEvent(event);
    setIsCreating(false);
    invalidateGlobalSearch();
  };

  return (
    <Box style={{ height: '100%', width: '100%', display: 'flex', overflow: 'hidden' }}>
      {/* Left Panel: Event List */}
      <Box style={{ width: '33.33%', height: '100%', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
        <ScrollArea h="100%" type="scroll">
          <Box p="md">
            <Group justify="space-between" mb="md">
              <Text size="lg" fw={700}>{t('dataPlane.events')}</Text>
              <Switch
                label={t('sidebar.editMode')}
                checked={isEditMode}
                onChange={(event) => {
                  setIsEditMode(event.currentTarget.checked);
                  setSelectedEvent(undefined);
                }}
              />
            </Group>

            {events.map(event => (
              <Paper
                key={event.key}
                id={`event-item-${event.key}`}
                withBorder
                p="sm"
                mb="sm"
                onClick={() => handleEventSelect(event)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedEvent?.key === event.key ? '#f0f9ff' : undefined,
                  borderColor: selectedEvent?.key === event.key ? '#228be6' : undefined
                }}
              >
                {selectedEvent?.key === event.key && isEditMode ? (
                  <EventEntity
                    event={selectedEvent!}
                    edit={true}
                    onUpdate={handleUpdateEvent}
                    onClose={() => handleEventSelect(undefined)}
                  />
                ) : (
                  <Box>
                    <Text fw={600} truncate>{event.title || t('dataPlane.untitledEvent')}</Text>
                    <Text size="sm" c="dimmed" lineClamp={2}>{event.description}</Text>
                  </Box>
                )}
              </Paper>
            ))}
            {isCreating ? (
              <Paper withBorder p="sm" mb="sm">
                <EventEntity
                  event={{} as V1Event}
                  edit={true}
                  onUpdate={handleCreateEvent}
                  onClose={() => setIsCreating(false)}
                />
              </Paper>
            ) : (
              <Button
                fullWidth
                variant="light"
                leftSection={<PlusIcon style={{ width: rem(18), height: rem(18) }} />}
                onClick={() => { setIsCreating(true); setSelectedEvent(undefined); }}
              />
            )}
          </Box>
        </ScrollArea>
      </Box>

      {/* Right Panel: Map */}
      <Box style={{ flex: 1, height: '100%', position: 'relative' }}>
        <EventMap
          events={events}
          relations={relations}
          selectedEvent={isEditMode ? undefined : selectedEvent}
          onEventSelect={handleEventSelect}
        />
      </Box>
    </Box>
  );
};
