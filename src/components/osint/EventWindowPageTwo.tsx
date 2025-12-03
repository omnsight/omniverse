import React from 'react';
import { Box, Paper, Text, Button, Stack, Group } from '@mantine/core';
import type { V1RelatedEntity } from '@omnsight/clients/dist/geovision/geovision.js';
import { PersonCard } from './entities/PersonEntity';
import { OrganizationCard } from './entities/OrganizationEntity';
import { SourceCard } from './entities/SourceEntity';
import { WebsiteCard } from './entities/WebsiteEntity';
import { RelationCard } from './entities/RelationEntity';

export interface PageTwoContext {
  mode: 'view' | 'create' | 'edit';
  entity: V1RelatedEntity;
}

interface EventWindowPageTwoProps {
  context: PageTwoContext;
  onSave: () => void;
}

export const EventWindowPageTwo: React.FC<EventWindowPageTwoProps> = ({ context, onSave }) => {
  const { entity, mode } = context;
  const isEditing = ['edit', 'create'].includes(mode);

  return (
    <Box p="lg">
      <Stack gap="xl">
        {/* BLOCK 1: THE ENTITY (Person, Org, etc.) */}
        <Paper withBorder p="md" radius="md">
          {entity.person && <PersonCard data={entity.person} edit={isEditing} />}
          {entity.organization && <OrganizationCard data={entity.organization} edit={isEditing} />}
          {entity.source && <SourceCard data={entity.source} edit={isEditing} />}
          {entity.website && <WebsiteCard data={entity.website} edit={isEditing} />}
        </Paper>

        {/* BLOCK 2: THE RELATION (Edge) */}
        {entity.relation && (
          <Paper withBorder p="md" radius="md" style={{ borderColor: '#228be6' }}>
            <Text fw={700} mb="md" size="lg" c="blue">
              Relation to Event
            </Text>
            <RelationCard data={entity.relation} edit={isEditing} />
          </Paper>
        )}

        {isEditing && (
          <Group justify="flex-end">
            <Button onClick={onSave}>Save Changes</Button>
          </Group>
        )}
      </Stack>
    </Box>
  );
};
