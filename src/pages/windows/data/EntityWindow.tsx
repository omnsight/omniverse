import React, { useEffect } from 'react';
import {
  Box,
  ScrollArea,
  Divider,
  SimpleGrid,
  Text,
  Stack,
  Group,
  LoadingOverlay,
  Button,
  ActionIcon,
} from '@mantine/core';
import { useEntitySelectionActions, useSelectedEntities } from './entitySelection';
import { useEntityDataActions } from '../network/entityData';
import { QueryService } from 'omni-osint-query-client';
import {
  AvatarSpan,
  OrganizationAvatar,
  WebsiteAvatar,
  PersonAvatar,
  SourceAvatarRow,
  EventAvatar,
} from '../../../components/avatars';
import { EntityFormRenderer, getEntityTitle } from '../../../components/forms/entityForm';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useEntityAuth, useAuth } from '../../../provider/AuthContext';
import { useInsightStore } from '../insight/insightData';
import { notifications } from '@mantine/notifications';
import { LinkIcon } from '@heroicons/react/24/solid';
import { useWindowStoreActions } from '../../../stores/windowStateStore';

export const EntityWindow: React.FC = () => {
  const { t } = useTranslation();
  const { user, hasRole } = useAuth();
  const selections = useSelectedEntities();
  const { setSelections } = useEntitySelectionActions();
  const { addEntities } = useEntityDataActions();
  const { selected } = useInsightStore();
  const { register, setDragging } = useWindowStoreActions();

  const lastSelection = selections[selections.length - 1];
  const { data: neighbors, isLoading } = useQuery({
    queryKey: ['neighbors', lastSelection?.data._id],
    queryFn: () => QueryService.queryNeighbors({ entity_id: lastSelection.data._id || '' }),
    enabled: !!lastSelection,
  });

  const auth = useEntityAuth(lastSelection?.data);
  const hasWritePermission = user ? (hasRole('admin') || hasRole('pro')) && auth.canEdit : false;

  useEffect(() => {
    register('entity-window', (savedState) => {
      setSelections(savedState.entities);
    });
  }, []);

  const handleDragStart = (e: React.DragEvent) => {
    if (!lastSelection.data._id) {
      notifications.show({
        title: t('data.entity.single.warning'),
        message: t('data.entity.single.noEntitySelected'),
        color: 'yellow',
      });
    } else if (!selected) {
      notifications.show({
        title: t('data.entity.single.warning'),
        message: t('data.entity.single.noInghtSelected'),
        color: 'yellow',
      });
    } else {
      const payload = {
        type: 'entity-window',
        label: getEntityTitle(lastSelection),
        state: { entities: [lastSelection.data._id] },
      };
      setDragging(payload);
      e.dataTransfer.setData('application/x-tiptap-node', JSON.stringify(payload));
      e.dataTransfer.effectAllowed = 'copy';
    }
  };

  if (!lastSelection) {
    return (
      <Box pos="relative" h="100%" w="100%">
        <Text>{t('data.entity.single.noEntitySelected')}</Text>
      </Box>
    );
  }

  return (
    <Box pos="relative" h="100%" w="100%">
      <Group justify="flex-start" mb="sm">
        <ActionIcon
          draggable
          onDragStart={handleDragStart}
          onDragEnd={() => setDragging(undefined)}
        >
          <LinkIcon width={16} />
        </ActionIcon>
      </Group>
      <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
      <EntityFormRenderer
        entity={lastSelection}
        onUpdated={hasWritePermission ? (entities) => addEntities(entities, undefined) : undefined}
      />

      <Divider my="sm" />

      {/* SCROLLABLE BODY */}
      <ScrollArea h="100%" type="scroll" offsetScrollbars>
        <Box p="lg" pb={100}>
          <SimpleGrid cols={2} spacing="xl">
            {/* Organizations */}
            <Stack gap="xs">
              <Text fw={600}>{t('data.entity.single.relatedOrganizations')}</Text>
              <AvatarSpan>
                {neighbors?.organizations?.map((entity: any) => (
                  <OrganizationAvatar
                    key={entity._id}
                    data={entity}
                    relation={neighbors?.relations?.find((r: any) => r._to === entity._id)}
                  />
                )) || []}
              </AvatarSpan>
            </Stack>

            {/* Websites */}
            <Stack gap="xs">
              <Text fw={600}>{t('data.entity.single.relatedWebsites')}</Text>
              <AvatarSpan>
                {neighbors?.websites?.map((entity: any) => (
                  <WebsiteAvatar
                    key={entity._id}
                    data={entity}
                    relation={neighbors?.relations?.find((r: any) => r._to === entity._id)}
                  />
                )) || []}
              </AvatarSpan>
            </Stack>

            {/* Events */}
            <Stack gap="xs">
              <Text fw={600}>{t('data.entity.single.relatedEvents')}</Text>
              <AvatarSpan>
                {neighbors?.events?.map((entity: any) => (
                  <EventAvatar
                    key={entity._id}
                    data={entity}
                    relation={neighbors?.relations?.find((r: any) => r._to === entity._id)}
                  />
                )) || []}
              </AvatarSpan>
            </Stack>
          </SimpleGrid>

          {/* Full Sources List */}
          <Stack gap="xs" mt="md">
            <Text fw={600}>{t('data.entity.single.relatedSources')}</Text>
            <Stack gap="xs">
              {neighbors?.sources?.map((source: any) => (
                <SourceAvatarRow
                  width={400}
                  key={source._id}
                  data={source}
                  relation={neighbors?.relations?.find((r: any) => r._to === source._id)}
                />
              )) || []}
            </Stack>
          </Stack>
        </Box>
      </ScrollArea>

      {/* STICKY BOTTOM LEFT: PERSONS */}
      <Box style={{ position: 'absolute', bottom: 15, left: 15, zIndex: 10 }}>
        <AvatarSpan>
          {neighbors?.persons?.map((person: any) => (
            <PersonAvatar
              key={person._id}
              data={person}
              relation={neighbors?.relations?.find((r: any) => r._to === person._id)}
            />
          )) || []}
        </AvatarSpan>
      </Box>

      {/* STICKY BOTTOM Right: Edit toggle */}
      <Box style={{ position: 'absolute', bottom: 15, right: 15, zIndex: 10 }}>
        <Stack align="flex-end" gap="xs">
          {hasWritePermission && (
            <Group gap="sm">
              <Button
                onClick={() => {
                  if (neighbors) {
                    addEntities(
                      {
                        events: neighbors.events,
                        organizations: neighbors.organizations,
                        people: neighbors.persons,
                        sources: neighbors.sources,
                        websites: neighbors.websites,
                        relations: neighbors.relations,
                      },
                      ['neighbors', lastSelection?.data._id],
                    );
                  }
                }}
              >
                {t('data.entity.single.addNeighbors')}
              </Button>
            </Group>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
