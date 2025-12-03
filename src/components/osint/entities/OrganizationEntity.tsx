import React from 'react';
import { Group, Text, ActionIcon, Stack, Avatar, Box, TextInput, rem } from '@mantine/core';
import { PlusIcon } from '@heroicons/react/24/solid';
import type { V1Organization, V1RelatedEntity } from '@omnsight/clients/dist/geovision/geovision.js';

const iconStyle = { width: rem(18), height: rem(18) };

// --- PROPS ---
interface OrganizationListProps {
  items: V1RelatedEntity[];
  onSelect: (entity: V1RelatedEntity) => void;
  onCreate: (entity: V1RelatedEntity) => void;
}

interface OrganizationCardProps {
  data: V1Organization;
  edit: boolean;
}

// --- LIST COMPONENT ---
export const OrganizationList: React.FC<OrganizationListProps> = ({ items, onSelect, onCreate }) => {
  return (
    <Box mb="xl">
      <Group mb="sm">
        <Text fw={600}>Organizations</Text>
        <ActionIcon size="sm" variant="subtle" onClick={() => onCreate({ organization: {}, relation: {} })}>
          <PlusIcon style={iconStyle} />
        </ActionIcon>
      </Group>
      <Stack gap="xs">
        {items.map(rel => {
          const org = rel.organization!;
          return (
            <Group
              key={org.id}
              onClick={() => onSelect(rel)}
              style={{ cursor: 'pointer' }}
            >
              <Avatar size="sm" radius="xl" color="blue">{org.name?.[0]}</Avatar>
              <Text size="sm">{org.name}</Text>
            </Group>
          );
        })}
      </Stack>
    </Box>
  );
};

// --- CARD COMPONENT ---
export const OrganizationCard: React.FC<OrganizationCardProps> = ({ data, edit }) => {
  if (edit) {
    return (
      <Stack>
        <TextInput label="Name" defaultValue={data?.name} />
        <TextInput label="Type" defaultValue={data?.type} />
      </Stack>
    )
  }
  return <Text size="lg" fw={700}>{data?.name} ({data?.type})</Text>;
};
