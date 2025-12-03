import React from 'react';
import { EventMap } from '../components/osint/EventMap';
import { Box } from '@mantine/core';

export const Geovision: React.FC = () => {
  return (
    <Box style={{ height: '100%', width: '100%' }}>
      <EventMap />
    </Box>
  );
};
