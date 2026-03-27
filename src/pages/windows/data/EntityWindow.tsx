import { truncate } from 'lodash';
import React, { useEffect } from 'react';
import {
  Box,
  ScrollArea,
  Divider,
  SimpleGrid,
  Text,
  Stack,
  Group,
  Breadcrumbs,
  Loader,
  Badge,
  Tooltip,
  Anchor,
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
  AvatarRowList,
} from '@omnsight/osint-entity-components/avatars';
import { EntityFormRenderer } from '../../../components/entity/FormRenderer';
import { getEntityTitle, type Entity } from '../../../components/entity/entity';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useEntityAuth, useAuth } from '../../../provider/AuthContext';
import { useInsightStore } from '../insight/insightData';
import { notifications } from '@mantine/notifications';
import { useWindowStoreActions } from '../../../stores/windowStateStore';
import { useWindowManager } from '../WindowManager';

interface EntityWindowContentProps {
  selectedEntity?: Entity;
  hasWritePermission: boolean;
}

const EntityWindowContent: React.FC<EntityWindowContentProps> = ({
  selectedEntity,
  hasWritePermission,
}) => {
  const { t } = useTranslation();
  const { addEntities } = useEntityDataActions();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['neighbors', selectedEntity?.data._id],
    queryFn: async () => {
      const response = await queryNeighbors({ path: { id: selectedEntity?.data._id || '' } });
      console.debug('queryNeighbors response', response);
      return response.data || {};
    },
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
        <Text>{t('pages.windows.data.EntityWindow.noEntitySelected')}</Text>
      </Group>
    );
  }

  return (
    <ScrollArea h="100%" type="scroll" offsetScrollbars>
      <EntityFormRenderer
        entity={selectedEntity}
        neighbors={data}
        onUpdate={hasWritePermission ? (entities) => addEntities(entities, undefined) : undefined}
        style={{ border: 'none', boxShadow: 'none', padding: 0 }}
      />

      <Divider my="sm" />

      {/* SCROLLABLE BODY */}
      <Box p="lg" pb={100}>
        <SimpleGrid cols={2} spacing="xl">
          {/* Organizations */}
          <Stack gap="xs">
            <Text fw={600}>{t('pages.windows.data.EntityWindow.relatedOrganizations')}</Text>
            <AvatarSpan>
              {data?.organizations?.map((entity: any) => (
                <OrganizationAvatar
                  key={entity._id}
                  data={entity}
                  relation={data?.relations?.find((r: any) => r._to === entity._id)}
                />
              )) || []}
              <EmptyAvatar />
            </AvatarSpan>
          </Stack>

          {/* Websites */}
          <Stack gap="xs">
            <Text fw={600}>{t('pages.windows.data.EntityWindow.relatedWebsites')}</Text>
            <AvatarSpan>
              {data?.websites?.map((entity: any) => (
                <WebsiteAvatar
                  key={entity._id}
                  data={entity}
                  relation={data?.relations?.find((r: any) => r._to === entity._id)}
                />
              )) || []}
              <EmptyAvatar />
            </AvatarSpan>
          </Stack>

          {/* Events */}
          <Stack gap="xs">
            <Text fw={600}>{t('pages.windows.data.EntityWindow.relatedEvents')}</Text>
            <AvatarSpan>
              {data?.events?.map((entity: any) => (
                <EventAvatar
                  key={entity._id}
                  data={entity}
                  relation={data?.relations?.find((r: any) => r._to === entity._id)}
                />
              )) || []}
            </AvatarSpan>
          </Stack>

          {/* Persons */}
          <Stack gap="xs">
            <Text fw={600}>{t('pages.windows.data.EntityWindow.relatedPersons')}</Text>
            <AvatarSpan>
              {data?.persons?.map((person: any) => (
                <PersonAvatar
                  key={person._id}
                  data={person}
                  relation={data?.relations?.find((r: any) => r._to === person._id)}
                />
              )) || []}
              <EmptyAvatar />
            </AvatarSpan>
          </Stack>
        </SimpleGrid>

        {/* Full Sources List */}
        <Stack gap="xs" mt="md">
          <Text fw={600}>{t('pages.windows.data.EntityWindow.relatedSources')}</Text>
          <AvatarRowList>
            {data?.sources?.map((source: any) => (
              <SourceAvatarRow
                key={source._id}
                data={source}
                relation={data?.relations?.find((r: any) => r._to === source._id)}
              />
            )) || []}
          </AvatarRowList>
        </Stack>
      </Box>
    </ScrollArea>
  );
};

export const EntityWindow: React.FC = () => {
  const { t } = useTranslation();
  const { user, hasRole } = useAuth();
  const selections = useSelectedEntities();
  const { setSelections } = useEntitySelectionActions();
  const { register, setDragging } = useWindowStoreActions();
  const { setActiveWindowByName } = useWindowManager();
  const lastSelection: Entity | undefined =
    selections.length > 0 ? selections[selections.length - 1] : undefined;
  const selected = useInsightStore((state) => state.getSelectedInsight());
  const auth = useEntityAuth(lastSelection?.data);
  const hasWritePermission = user ? (hasRole('admin') || hasRole('pro')) && auth.canEdit : false;

  const breadcrumbs = [
    <Anchor href="#" onClick={() => setActiveWindowByName('EntityList')} key="1">
      {t('pages.windows.data.EntityWindow.title')}
    </Anchor>,
  ];
  if (lastSelection) {
    breadcrumbs.push(
      <Tooltip label={getEntityTitle(lastSelection)} withArrow>
        <Text key="2" truncate="end" style={{ maxWidth: 200 }}>
          {truncate(getEntityTitle(lastSelection), { length: 20 })}
        </Text>
      </Tooltip>,
    );
  }

  useEffect(() => {
    register('entity-window', (savedState) => {
      setSelections(savedState.entities);
    });
  }, []);

  const handleDragStart = (e: React.DragEvent) => {
    if (!lastSelection || !lastSelection.data._id) {
      notifications.show({
        title: t('common.warning'),
        message: t('pages.windows.data.EntityWindow.noEntitySelected'),
        color: 'orange',
      });
    } else if (!selected) {
      notifications.show({
        title: t('common.warning'),
        message: t('pages.windows.data.EntityWindow.noInghtSelected'),
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
      <Group p="lg" pb={0}>
        <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
        <Tooltip label={t('pages.windows.data.EntityWindow.dragTip')}>
          <Badge
            draggable
            onDragStart={handleDragStart}
            onDragEnd={() => setDragging(undefined)}
            style={{ cursor: 'grab' }}
          >
            +
          </Badge>
        </Tooltip>
      </Group>
      <EntityWindowContent selectedEntity={lastSelection} hasWritePermission={hasWritePermission} />
    </Box>
  );
};
