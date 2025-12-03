import React from 'react';
import { Group, Text, ActionIcon, Stack, Box, TextInput, rem } from '@mantine/core';
import { PlusIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import type { V1RelatedEntity, V1Website } from '@omnsight/clients/dist/geovision/geovision.js';

const iconStyle = { width: rem(18), height: rem(18) };

// --- PROPS ---
interface WebsiteListProps {
  items: V1RelatedEntity[];
  onSelect: (entity: V1RelatedEntity) => void;
  onCreate: (entity: V1RelatedEntity) => void;
}

interface WebsiteCardProps {
  data: V1Website;
  edit: boolean;
}

// --- LIST COMPONENT ---
export const WebsiteList: React.FC<WebsiteListProps> = ({ items, onSelect, onCreate }) => {
  return (
    <Box mb="xl">
      <Group mb="sm">
        <Text fw={600}>Websites</Text>
        <ActionIcon size="sm" variant="subtle" onClick={() => onCreate({ website: {}, relation: {} })}>
          <PlusIcon style={iconStyle} />
        </ActionIcon>
      </Group>
      <Stack gap="xs">
        {items.map(rel => {
          const web = rel.website!;
          return (
            <Group 
              key={web.id} 
              onClick={() => onSelect(rel)}
              style={{ cursor: 'pointer' }}
            >
              <ArrowTopRightOnSquareIcon style={iconStyle} />
              <Text size="sm">{web.domain}</Text>
            </Group>
          );
        })}
      </Stack>
    </Box>
  );
};

// --- CARD COMPONENT ---
export const WebsiteCard: React.FC<WebsiteCardProps> = ({ data, edit }) => {
    if (edit) {
        return <TextInput label="Domain/URL" defaultValue={data?.domain} />;
    }
    return <Text fw={700}>{data?.domain}</Text>;
};
