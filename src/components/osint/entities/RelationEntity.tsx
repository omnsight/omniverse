import React from 'react';
import { Stack, Group, Text, TextInput, NumberInput, Textarea } from '@mantine/core';
import type { V1Relation } from '@omnsight/clients/dist/geovision/geovision';

interface RelationCardProps {
  data: V1Relation;
  edit: boolean;
}

export const RelationCard: React.FC<RelationCardProps> = ({ data, edit }) => {
  if (edit) {
    return (
      <Stack>
        <TextInput label="Relation Name" defaultValue={data?.name} placeholder="e.g., attended, organized" />
        <NumberInput label="Confidence (0-100)" defaultValue={data?.confidence} />
        <Textarea label="Notes/Attributes" autosize minRows={2} />
      </Stack>
    );
  }
  return (
    <Stack gap="xs">
      <Group>
        <Text fw={600}>Type:</Text> 
        <Text>{data.name || 'Unspecified'}</Text>
      </Group>
      <Group>
        <Text fw={600}>Confidence:</Text> 
        <Text>{data.confidence || 0}%</Text>
      </Group>
    </Stack>
  );
};
