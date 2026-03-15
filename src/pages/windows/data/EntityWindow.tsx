import React from 'react';
import {
  Box,
  ScrollArea,
  Divider,
  SimpleGrid,
  Text,
  Stack,
  Group,
  LoadingOverlay,
  Switch,
  Button,
} from '@mantine/core';
import { useSelectedEntities } from './entitySelection';
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
import { EntityFormRenderer } from '../../../components/forms/EntityFormRenderer';
import { UpdateService } from 'omni-osint-crud-client';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useEntityAuth, useAuth } from '../../../provider/AuthContext';

export const EntityWindow: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const selections = useSelectedEntities();
  const { addEntities } = useEntityDataActions();
  const [isEditing, setIsEditing] = React.useState(false);

  const lastSelection = selections[selections.length - 1];
  const { data: neighbors, isLoading } = useQuery({
    queryKey: ['neighbors', lastSelection?.data._id],
    queryFn: () => QueryService.queryNeighbors({ entity_id: lastSelection.data._id || '' }),
    enabled: !!lastSelection,
  });

  const auth = useEntityAuth(lastSelection?.data);

  const handleUpdate = (data: any) => {
    if (!lastSelection?.data._id) return;
    switch (lastSelection.type) {
      case 'Event':
        UpdateService.updateEvent(lastSelection.data._id, data);
        break;
      case 'Organization':
        UpdateService.updateOrganization(lastSelection.data._id, data);
        break;
      case 'Person':
        UpdateService.updatePerson(lastSelection.data._id, data);
        break;
      case 'Relation':
        UpdateService.updateRelation(lastSelection.data._id, data);
        break;
      case 'Source':
        UpdateService.updateSource(lastSelection.data._id, data);
        break;
      case 'Website':
        UpdateService.updateWebsite(lastSelection.data._id, data);
        break;
    }
  };

  if (!lastSelection) {
    return (
      <Box style={{ height: '100%', width: '100%', position: 'relative' }}>
        <Text>{t('data.entity.single.noEntitySelected')}</Text>
      </Box>
    );
  }

  return (
    <Box style={{ height: '100%', width: '100%', position: 'relative' }}>
      <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
      <EntityFormRenderer entity={lastSelection} onUpdate={isEditing ? handleUpdate : undefined} />

      <Divider my="sm" />

      {/* A. SCROLLABLE BODY */}
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

      {/* B. STICKY BOTTOM LEFT: PERSONS */}
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

      {/* C. STICKY BOTTOM Right: Edit toggle */}
      <Box style={{ position: 'absolute', bottom: 15, right: 15, zIndex: 10 }}>
        <Group>
          <Group align="center">
            <Text fw={500}>{lastSelection.type}</Text>
            {auth.canEdit && (
              <Switch
                checked={isEditing}
                onChange={(event) => setIsEditing(event.currentTarget.checked)}
              />
            )}
          </Group>
          {user?.roles?.includes('pro') && (
            <Group>
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
        </Group>
      </Box>
    </Box>
  );
};
