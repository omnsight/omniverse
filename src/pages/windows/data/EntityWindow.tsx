import React, { useEffect } from 'react';
import {
  Box,
  ScrollArea,
  Divider,
  SimpleGrid,
  Text,
  Stack,
  Group,
  Button,
  ActionIcon,
  Title,
  Loader,
  Paper,
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
import { EntityFormRenderer } from '../../../components/entity/FormRenderer';
import { getEntityTitle, type Entity } from '../../../components/entity/entity';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useEntityAuth, useAuth } from '../../../provider/AuthContext';
import { useInsightStore } from '../insight/insightData';
import { notifications } from '@mantine/notifications';
import { useWindowStoreActions } from '../../../stores/windowStateStore';
import { PlusCircleIcon } from '@heroicons/react/16/solid';

interface EntityWindowContentProps {
  selectedEntity?: Entity;
  hasWritePermission: boolean;
  handleDragStart: (e: React.DragEvent) => void;
}

const EntityWindowContent: React.FC<EntityWindowContentProps> = ({
  selectedEntity,
  hasWritePermission,
  handleDragStart,
}) => {
  const { t } = useTranslation();
  const { addEntities } = useEntityDataActions();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['neighbors', selectedEntity?.data._id],
    queryFn: () => queryNeighbors({ path: { id: selectedEntity?.data._id || '' } }),
    enabled: !!selectedEntity,
  });

  useEffect(() => {
    if (isError) {
      console.error('Error fetching entity data', error);
      notifications.show({
        title: t('common.error'),
        message: t('pages.windows.data.EntityWindow.queryError', '?'),
        color: 'red',
      });
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <Group justify="center" align="center" style={{ flex: 1 }}>
        <Loader />
      </Group>
    );
  }

  if (!selectedEntity) {
    return (
      <Group justify="center" align="center" style={{ flex: 1 }}>
        <Text>{t('pages.windows.data.EntityWindow.noEntitySelected', '?')}</Text>
      </Group>
    );
  }

  return (
    <Paper withBorder p="md" style={{ flex: 1, position: 'relative' }}>
      <EntityFormRenderer
        entity={selectedEntity}
        onUpdate={hasWritePermission ? (entities) => addEntities(entities, undefined) : undefined}
        style={{ border: 'none', boxShadow: 'none', padding: 0 }}
      />

      <Divider my="sm" />

      {/* SCROLLABLE BODY */}
      <ScrollArea h="100%" type="scroll" offsetScrollbars>
        <Box p="lg" pb={100}>
          <SimpleGrid cols={2} spacing="xl">
            {/* Organizations */}
            <Stack gap="xs">
              <Text fw={600}>{t('pages.windows.data.EntityWindow.relatedOrganizations', '?')}</Text>
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
              <Text fw={600}>{t('pages.windows.data.EntityWindow.relatedWebsites', '?')}</Text>
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
              <Text fw={600}>{t('pages.windows.data.EntityWindow.relatedEvents', '?')}</Text>
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
            <Text fw={600}>{t('pages.windows.data.EntityWindow.relatedSources', '?')}</Text>
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
                      ['neighbors', selectedEntity?.data._id],
                    );
                  }
                }}
              >
                {t('pages.windows.data.EntityWindow.addNeighbors', '?')}
              </Button>
            </Group>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export const EntityWindow: React.FC = () => {
  const { t } = useTranslation();
  const { user, hasRole } = useAuth();
  const selections = useSelectedEntities();
  const { setSelections } = useEntitySelectionActions();
  const { register, setDragging } = useWindowStoreActions();
  const lastSelection: Entity | undefined =
    selections.length > 0 ? selections[selections.length - 1] : undefined;
  const selected = useInsightStore((state) => state.getSelectedInsight());
  const auth = useEntityAuth(lastSelection?.data);
  const hasWritePermission = user ? (hasRole('admin') || hasRole('pro')) && auth.canEdit : false;

  useEffect(() => {
    register('entity-window', (savedState) => {
      setSelections(savedState.entities);
    });
  }, []);

  const handleDragStart = (e: React.DragEvent) => {
    if (!lastSelection || !lastSelection.data._id) {
      notifications.show({
        title: t('pages.windows.data.EntityWindow.warning', '?'),
        message: t('pages.windows.data.EntityWindow.noEntitySelected', '?'),
        color: 'orange',
      });
    } else if (!selected) {
      notifications.show({
        title: t('pages.windows.data.EntityWindow.warning', '?'),
        message: t('pages.windows.data.EntityWindow.noInghtSelected', '?'),
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

  return (
    <Box pos="relative" h="100%" w="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Box p="lg" pb={0}>
        <Title order={3}>{t('pages.windows.data.EntityWindow.title', '?')}</Title>
        <ActionIcon
          draggable
          onDragStart={handleDragStart}
          onDragEnd={() => setDragging(undefined)}
        >
          <PlusCircleIcon />
        </ActionIcon>
      </Box>
      <EntityWindowContent
        selectedEntity={lastSelection}
        hasWritePermission={hasWritePermission}
        handleDragStart={handleDragStart}
      />
    </Box>
  );
};
