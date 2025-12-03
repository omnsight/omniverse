import React from 'react';
import { Group, Text, ActionIcon, Stack, Box, TextInput, NumberInput, Popover, Tooltip, rem } from '@mantine/core';
import { PlusIcon, LinkIcon } from '@heroicons/react/24/solid';
import type { V1RelatedEntity, V1Source } from '@omnsight/clients/dist/geovision/geovision.js';

const iconStyle = { width: rem(18), height: rem(18) };
const lgIconStyle = { width: rem(24), height: rem(24) };

// --- PROPS ---
interface SourceListProps {
  items: V1RelatedEntity[];
  onSelect: (entity: V1RelatedEntity) => void;
  onCreate: (entity: V1RelatedEntity) => void;
  variant?: 'default' | 'popover';
}

interface SourceCardProps {
  data: V1Source;
  edit: boolean;
}

// --- LIST COMPONENT ---
export const SourceList: React.FC<SourceListProps> = ({ items, onSelect, onCreate, variant = 'default' }) => {

  if (variant === 'popover') {
    return (
      <Popover position="right-start" withArrow shadow="md" width={60} withinPortal>
        <Popover.Target>
          <ActionIcon variant="light" color="blue" size="lg" radius="xl">
            <LinkIcon style={lgIconStyle} />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown style={{ padding: 5, backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}>
          <Stack gap={5} style={{ backgroundColor: 'white', padding: 5, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {items.map(rel => {
              const src = rel.source!;
              return (
                <Tooltip key={src.id} label={src.name} position="right">
                  <ActionIcon
                    component="a"
                    href={src.url}
                    target="_blank"
                    variant="subtle"
                    size="sm"
                  >
                    <LinkIcon style={iconStyle} />
                  </ActionIcon>
                </Tooltip>
              );
            })}
            <ActionIcon size="sm" variant="outline" onClick={() => onCreate({ source: {}, relation: {} })}>
              <PlusIcon style={{ width: rem(14), height: rem(14) }} />
            </ActionIcon>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    );
  }

  return (
    <Box mb="xl">
      <Group mb="sm">
        <Text fw={600}>Full Source Details</Text>
        <ActionIcon size="sm" variant="subtle" onClick={() => onCreate({ source: {}, relation: {} })}>
          <PlusIcon style={iconStyle} />
        </ActionIcon>
      </Group>
      <Stack gap="sm">
        {items.map(rel => {
          const src = rel.source!;
          return (
            <Box key={src.id} onClick={() => onSelect(rel)} style={{ cursor: 'pointer' }}>
              <Text size="sm" fw={500}>{src.name}</Text>
              <Text size="xs" c="dimmed" truncate>{src.url}</Text>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

// --- CARD COMPONENT ---
export const SourceCard: React.FC<SourceCardProps> = ({ data, edit }) => {
  if (edit) {
    return (
      <Stack>
        <TextInput label="Name" defaultValue={data?.name} />
        <TextInput label="URL" defaultValue={data?.url} />
        <NumberInput label="Reliability" defaultValue={data?.reliability} max={10} min={0} />
      </Stack>
    );
  } else {
    return (
      <Box>
        <Text fw={700}>{data?.name}</Text>
        <Text c="blue" component="a" href={data?.url}>{data?.url}</Text>
        <Text size="sm">Reliability: {data?.reliability}</Text>
      </Box>
    );
  }
};
