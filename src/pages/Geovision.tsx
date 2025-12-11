import React, { useState } from 'react';
import { EventMap } from '../components/osint/EventMap';
import { Box } from '@mantine/core';
import { useGlobalSearch } from '../utilties/useGlobalSearchResult';
import type { V1Event } from '@omnsight/clients/dist/geovision/geovision';

export const Geovision: React.FC = () => {
  const { data } = useGlobalSearch();
  const { events = [], relations = [] } = data?.data || {};
  const [selectedEvent, setSelectedEvent] = useState<V1Event | undefined>(undefined);

  return (
    <Box style={{ height: '100%', width: '100%' }}>
      <EventMap
        events={events}
        relations={relations}
        selectedEvent={selectedEvent}
        onEventSelect={setSelectedEvent}
      />
    </Box>
  );
};
