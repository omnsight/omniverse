import { memo } from 'react';
import { type NodeProps } from 'reactflow';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Text } from '@mantine/core';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { NodeHandles } from '../../common/NodeHandles';
import type { V1Event } from '@omnsight/clients/dist/omndapi/omndapi.js';
import type { EntityType } from '../../../store/graphData';

export const EventNode: React.FC<NodeProps<EntityType>> = memo(({ data, selected }) => {
  const { t } = useTranslation();
  const event = data as V1Event;

  return (
    <Box style={{ position: 'relative' }}>
      <NodeHandles />
      <Avatar
        color="blue"
        radius="xl"
        size="md"
        style={{
          border: selected ? '2px solid var(--mantine-color-blue-6)' : '2px solid transparent',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        }}
      >
        <CalendarDaysIcon style={{ width: '60%', height: '60%' }} />
      </Avatar>
      <Text
        fz={8}
        fw={500}
        c="dimmed"
        pos="absolute"
        top="100%"
        left="50%"
        mt={4}
        style={{
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {event?.title || t('placeholder.unknown') + t('entity.event.title')}
      </Text>
    </Box>
  );
});
