import React, { memo } from 'react';
import { type NodeProps } from 'reactflow';
import { Avatar, Box, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { Source } from 'omni-osint-crud-client';
import { NodeHandles } from './NodeHandles';
import { SourceIcon } from '@omnsight/osint-entity-components/icons';

export const SourceNode: React.FC<NodeProps<Source>> = memo(({ data, selected }) => {
  const { t } = useTranslation();
  const source = data as Source & { hideHandles?: boolean };

  return (
    <Box style={{ position: 'relative', opacity: source.hideHandles ? 0.5 : 1 }}>
      {!source.hideHandles && <NodeHandles />}
      <Avatar
        color="gray"
        radius="xl"
        size="md"
        style={{
          border: selected ? '2px solid var(--mantine-color-blue-6)' : '2px solid transparent',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        }}
      >
        <SourceIcon source={source} size="xl" />
      </Avatar>
      <Text
        fz={10}
        fw={500}
        pos="absolute"
        top="95%"
        left="50%"
        mt={4}
        style={{
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {t('components.graph.nodes.SourceNode.name')}
      </Text>
      <Text
        fz={8}
        fw={500}
        c="dimmed"
        pos="absolute"
        top="125%"
        left="50%"
        mt={4}
        style={{
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {source?.name || t('placeholder.unknown') + t('components.graph.nodes.SourceNode.name')}
      </Text>
    </Box>
  );
});
