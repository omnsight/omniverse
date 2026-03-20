import React, { memo } from 'react';
import { type NodeProps } from 'reactflow';
import { Avatar, Box, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { UserIcon } from '@heroicons/react/24/solid';
import type { Person } from 'omni-osint-crud-client';
import { NodeHandles } from './NodeHandles';

export const PersonNode: React.FC<NodeProps<Person>> = memo(({ data, selected }) => {
  const { t } = useTranslation();
  const person = data as Person & { hideHandles?: boolean };

  return (
    <Box style={{ position: 'relative', opacity: person.hideHandles ? 0.5 : 1 }}>
      {!person.hideHandles && <NodeHandles />}
      <Avatar
        color="teal"
        radius="xl"
        size="md"
        style={{
          border: selected ? '2px solid var(--mantine-color-blue-6)' : '2px solid transparent',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        }}
      >
        <UserIcon style={{ width: '60%', height: '60%' }} />
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
        {person?.name || t('placeholder.unknown') + t('components.graph.nodes.PersonNode.name')}
      </Text>
    </Box>
  );
});
