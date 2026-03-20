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
  Title,
  Loader,
} from '@mantine/core';
import { useEntitySelectionActions, useSelectedEntities } from './entitySelection';
import { useEntityDataActions } from '../network/entityData';
import { queryNeighbors } from 'omni-osint-query-client';
import {
  AvatarSpan,
  OrganizationAvatar,
  WebsiteAvatar,
  PersonAvatar,
  SourceAvatarRow,
  EventAvatar,
  EmptyAvatar,
} from '../../../components/avatars';
import { EntityFormRenderer, getEntityTitle } from '../../../components/forms/entityForm';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useEntityAuth, useAuth } from '../../../provider/AuthContext';
import { useInsightStore } from '../insight/insightData';
import { notifications } from '@mantine/notifications';
import { LinkIcon } from '@heroicons/react/24/solid';
import { useWindowStoreActions } from '../../../stores/windowStateStore';

const EntityWindowContent: React.FC = () => {
  const { t } = useTranslation();
  const { user, hasRole } = useAuth();
  const selections = useSelectedEntities();
  const { setSelections } = useEntitySelectionActions();
  const { addEntities } = useEntityDataActions();
  const { selected } = useInsightStore();
  const { register, setDragging } = useWindowStoreActions();

  const lastSelection = selections[selections.length - 1];
  const auth = useEntityAuth(lastSelection?.data);
  const hasWritePermission = user ? (hasRole('admin') || hasRole('pro')) && auth.canEdit : false;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['neighbors', lastSelection?.data._id],
    queryFn: () => queryNeighbors({ body: { entity_id: lastSelection.data._id || '' } }),
    enabled: !!lastSelection,
  });

  useEffect(() => {
    if (isError) {
      console.error('Error fetching entity data', error);
      notifications.show({
        title: t('common.error'),
        message: t('data.entity.single.queryError'),
        color: 'red',
      });
    }
  }, [isError, error]);

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
        color: 'orange',
      });
    } else if (!selected) {
      notifications.show({
        title: t('data.entity.single.warning'),
        message: t('data.entity.single.noInghtSelected'),
        color: 'orange',
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

  if (isLoading) {
    return (
      <Group justify="center" align="center" style={{ flex: 1 }}>
        <Loader />
      </Group>
    );
  }

  if (!lastSelection) {
    return (
      <Group justify="center" align="center" style={{ flex: 1 }}>
        <Text>{t('data.entity.single.noEntitySelected')}</Text>
      </Group>
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
                {data?.data?.organizations?.map((entity: any) => (
                  <OrganizationAvatar
                    key={entity._id}
                    data={entity}
                    relation={data?.data?.relations?.find((r: any) => r._to === entity._id)}
                  />
                )) || []}
                <EmptyAvatar />
              </AvatarSpan>
            </Stack>

            {/* Websites */}
            <Stack gap="xs">
              <Text fw={600}>{t('data.entity.single.relatedWebsites')}</Text>
              <AvatarSpan>
                {data?.data?.websites?.map((entity: any) => (
                  <WebsiteAvatar
                    key={entity._id}
                    data={entity}
                    relation={data?.data?.relations?.find((r: any) => r._to === entity._id)}
                  />
                )) || []}
                <EmptyAvatar />
              </AvatarSpan>
            </Stack>

            {/* Events */}
            <Stack gap="xs">
              <Text fw={600}>{t('data.entity.single.relatedEvents')}</Text>
              <AvatarSpan>
                {data?.data?.events?.map((entity: any) => (
                  <EventAvatar
                    key={entity._id}
                    data={entity}
                    relation={data?.data?.relations?.find((r: any) => r._to === entity._id)}
                  />
                )) || []}
              </AvatarSpan>
            </Stack>
          </SimpleGrid>

          {/* Full Sources List */}
          <Stack gap="xs" mt="md">
            <Text fw={600}>{t('data.entity.single.relatedSources')}</Text>
            <Stack gap="xs">
              {data?.data?.sources?.map((source: any) => (
                <SourceAvatarRow
                  width={400}
                  key={source._id}
                  data={source}
                  relation={data?.data?.relations?.find((r: any) => r._to === source._id)}
                />
              )) || []}
            </Stack>
          </Stack>
        </Box>
      </ScrollArea>

      {/* STICKY BOTTOM LEFT: PERSONS */}
      <Box style={{ position: 'absolute', bottom: 15, left: 15, zIndex: 10 }}>
        <AvatarSpan>
          {data?.data?.persons?.map((person: any) => (
            <PersonAvatar
              key={person._id}
              data={person}
              relation={data?.data?.relations?.find((r: any) => r._to === person._id)}
            />
          )) || []}
          <EmptyAvatar />
        </AvatarSpan>
      </Box>

      {/* STICKY BOTTOM Right */}
      <Box style={{ position: 'absolute', bottom: 15, right: 15, zIndex: 10 }}>
        <Stack align="flex-end" gap="xs">
          {hasWritePermission && (
            <Group gap="sm">
              <Button
                onClick={() => {
                  if (data?.data) {
                    addEntities(
                      {
                        events: data?.data?.events,
                        organizations: data?.data?.organizations,
                        people: data?.data?.persons,
                        sources: data?.data?.sources,
                        websites: data?.data?.websites,
                        relations: data?.data?.relations,
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

export const EntityWindow: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box pos="relative" h="100%" w="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Box p="lg" pb={0}>
        <Title order={3}>{t('data.entity.single.title')}</Title>
      </Box>
      <EntityWindowContent />
    </Box>
  );
};
