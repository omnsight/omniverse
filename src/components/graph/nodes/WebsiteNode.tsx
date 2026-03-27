import React, { memo } from 'react';
import { type NodeProps } from 'reactflow';
import { Avatar, Box, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { Website } from 'omni-osint-crud-client';
import { NodeHandles } from './NodeHandles';
import { WebsiteIcon } from '@omnsight/osint-entity-components/icons';

export const WebsiteNode: React.FC<NodeProps<Website>> = memo(({ data, selected }) => {
  const { t } = useTranslation();
  const website = data as Website & { hideHandles?: boolean };

  return (
    <Box style={{ position: 'relative', opacity: website.hideHandles ? 0.5 : 1 }}>
      {!website.hideHandles && <NodeHandles />}
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
        <WebsiteIcon website={website} size="xl" />
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
        {website?.url || t('placeholder.unknown') + t('components.graph.nodes.WebsiteNode.name', '?')}
      </Text>
    </Box>
  );
});
