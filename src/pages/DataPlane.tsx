import React, { useState, useEffect } from 'react';
import { Grid, Box, ScrollArea, Text, Paper, Loader, Center } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { EventMap } from '../components/osint/EventMap';
import { EventEntity } from '../components/osint/entities/EventEntity';
import { useAppStore } from '../utilties/useAppStore';
import type { V1Event } from '@omnsight/clients/dist/geovision/geovision.js';
import { useAuth } from '../utilties/AuthProvider';

export const DataPlane: React.FC = () => {
  const { events } = useAppStore();
  const { hasRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<V1Event | null>(null);

  useEffect(() => {
    if (!isLoading && !hasRole('admin')) {
      navigate('/error', {
        state: {
          title: 'Access Denied',
          description: 'You do not have permission to access the Data Plane. Admin role required.'
        },
        replace: true
      });
    }
  }, [hasRole, isLoading, navigate]);

  if (isLoading) {
    return (
      <Center h="100%">
        <Loader size="lg" />
      </Center>
    );
  }

  // Double check to prevent render flash
  if (!hasRole('admin')) {
    return (
      <Center h="100%">
        <Loader size="lg" />
      </Center>
    );
  }

  const handleEventSelect = (event: V1Event | null) => {
    setSelectedEvent(event);

    // Scroll into view logic could be added here if needed
    if (event) {
      const element = document.getElementById(`event-item-${event.key}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleUpdateEvent = (updatedEvent: V1Event) => {
    // In a real app, this would call an API or store action
    console.log('Updating event:', updatedEvent);
    // For now, we might update local state or store if available
    // updateEvent(updatedEvent); 
  };

  return (
    <Grid gutter={0} style={{ height: '100%', overflow: 'hidden' }}>
      {/* Left Panel: Event List */}
      <Grid.Col span={4} style={{ height: '100%', borderRight: '1px solid #eee' }}>
        <ScrollArea h="100%" type="scroll">
          <Box p="md">
            <Text size="lg" fw={700} mb="md">Events</Text>
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
                {selectedEvent?.key === event.key ? (
                  <EventEntity event={event} edit={true} onUpdate={handleUpdateEvent} />
                ) : (
                  <Box>
                    <Text fw={600} truncate>{event.title || 'Untitled Event'}</Text>
                    <Text size="sm" c="dimmed" lineClamp={2}>{event.description}</Text>
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        </ScrollArea>
      </Grid.Col>

      {/* Right Panel: Map */}
      <Grid.Col span={8} style={{ height: '100%' }}>
        <EventMap
          selectedEvent={selectedEvent}
          onEventSelect={handleEventSelect}
        />
      </Grid.Col>
    </Grid>
  );
};
