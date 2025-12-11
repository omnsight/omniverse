import React from 'react';
import { Box, Text, Button, Group, Divider, ScrollArea, Center, Stack, rem } from '@mantine/core';
import { LinkSlashIcon } from '@heroicons/react/24/solid';
import type { V1RelatedEntity } from '@omnsight/clients/dist/geovision/geovision.js';
import { PersonCard } from './entities/PersonEntity';
import { OrganizationCard } from './entities/OrganizationEntity';
import { SourceCard } from './entities/SourceEntity';
import { WebsiteCard } from './entities/WebsiteEntity';
import { RelationCard } from './entities/RelationEntity';

export interface PageTwoContext {
  entity: V1RelatedEntity;
  create: boolean;
}

interface EventWindowPageTwoProps {
  context: PageTwoContext;
  onSave: () => void;
}

export const EventWindowPageTwo: React.FC<EventWindowPageTwoProps> = ({ context, onSave }) => {
  const { entity } = context;

  const handleSave = () => {
    onSave();
  };

  return (
    <ScrollArea h="100%" type="scroll" offsetScrollbars>
      <Box p="lg">
        {/* BLOCK 1: THE ENTITY (Person, Org, etc.) */}
        <Box>
          {entity.person && <PersonCard data={entity.person} edit={true} />}
          {entity.organization && <OrganizationCard data={entity.organization} edit={true} />}
          {entity.source && <SourceCard data={entity.source} edit={true} />}
          {entity.website && <WebsiteCard data={entity.website} edit={true} />}
        </Box>

        {/* DIVIDER */}
        <Divider my="md" />

        {/* BLOCK 2: THE RELATION (Edge) */}
        <Box>
          <Text fw={700} mb="md" size="lg" c="blue">
            关联详情
          </Text>
          {entity.relation ? (
            <RelationCard data={entity.relation!} edit={true} />
          ) : (
            <Center py="xl">
              <Stack align="center" gap="xs">
                <LinkSlashIcon style={{ width: rem(32), height: rem(32), color: 'var(--mantine-color-gray-4)' }} />
                <Text size="sm" c="dimmed">无内容</Text>
              </Stack>
            </Center>
          )}
        </Box>

        <Group justify="flex-end" mt="xl">
          <Button onClick={handleSave}>保存</Button>
        </Group>
      </Box>
    </ScrollArea>
  );
};
