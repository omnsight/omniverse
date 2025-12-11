import React, { useState, useEffect } from 'react';
import { Box, ScrollArea, Text, Paper, Loader, Center, Switch, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EventMap } from '../components/osint/EventMap';
import { EventEntity } from '../components/osint/entities/EventEntity';
import type { V1Event } from '@omnsight/clients/dist/geovision/geovision.js';
import { useAuth } from '../utilties/AuthProvider';
import { useGlobalSearch } from '../utilties/useGlobalSearchResult';

export const DataPlane: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useGlobalSearch();
  const { events = [], relations = [] } = data?.data || {};
  const { hasRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<V1Event | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState(false);

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
    // If we are in edit mode and the event is already selected, do nothing
    // This prevents the inputs from losing focus/resetting when clicking inside the component
    if (isEditMode && selectedEvent?.key === event?.key) {
      return;
    }

    setSelectedEvent(event);

    if (event) {
      const element = document.getElementById(`event-item-${event.key}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleUpdateEvent = (updates: Partial<V1Event>) => {
    if (selectedEvent) {
    }
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
                  <EventEntity event={selectedEvent!} edit={true} onUpdate={handleUpdateEvent} />
                ) : (
                  <Box>
                    <Text fw={600} truncate>{event.title || t('dataPlane.untitledEvent')}</Text>
                    <Text size="sm" c="dimmed" lineClamp={2}>{event.description}</Text>
                  </Box>
                )}
              </Paper>
            ))}
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
