import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Avatar, HoverCard } from '@mantine/core';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { EventCard } from './Card';
import type { EntityData } from '../../graph/types';
import type { V1Event } from '@omnsight/clients/dist/omndapi/omndapi.js';

export const EventNode: React.FC<NodeProps<EntityData>> = memo(({ data, selected }) => {
  return (
    <HoverCard width={300} shadow="md" withArrow openDelay={200} closeDelay={0}>
      <HoverCard.Target>
        <div style={{ position: 'relative' }}>
          <Handle type="target" position={Position.Top} style={{ background: '#555', top: -5 }} />
          <Avatar
            color="blue"
            radius="xl"
            size="lg"
            style={{
              border: selected ? '2px solid var(--mantine-color-blue-6)' : '2px solid transparent',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            }}
          >
            <CalendarDaysIcon style={{ width: '60%', height: '60%' }} />
          </Avatar>
          <Handle
            type="source"
            position={Position.Bottom}
            style={{ background: '#555', bottom: -5 }}
          />
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <EventCard event={data.details as V1Event} withTitle />
      </HoverCard.Dropdown>
    </HoverCard>
  );
});
