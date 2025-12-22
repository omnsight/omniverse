import React from 'react';
import { Box, ScrollArea, Divider, SimpleGrid, Text, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { V1Event } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { WindowModal } from '../../common/WindowModal';
import { EventCard } from './Card';
import { AvatarSpan } from '../common/AvatarSpan';
import { useEventRelatedEntities } from '../../../store/localData';
import { OrganizationAvatar } from '../organization/Avatar';
import { WebsiteAvatar } from '../website/Avatar';
import { PersonAvatar } from '../person/Avatar';
import { SourceAvatar, SourceAvatarRow } from '../source/Avatar';
import { AvatarDropdown } from '../common/AvatarDropdown';
import { ChevronDownIcon, LinkIcon } from '@heroicons/react/16/solid';
import { getLocalizedAttribute } from '../common/localeSupport';

interface EventWindowProps {
  isOpen: boolean;
  onClose: () => void;
  event: V1Event;
}

export const EventWindow: React.FC<EventWindowProps> = ({ isOpen, onClose, event }) => {
  const { t, i18n } = useTranslation();
  const { organizations, websites, sources, persons } = useEventRelatedEntities(event.id);

  return (
    <WindowModal
      opened={isOpen}
      onClose={onClose}
      isLoading={false}
      breadcrumbs={[
        {
          label:
            getLocalizedAttribute(event, 'Title', i18n.language) ||
            t('entity.event.Window.untitledEvent'),
        },
      ]}
    >
      {/* A. SCROLLABLE BODY */}
      <ScrollArea h="100%" type="scroll" offsetScrollbars>
        <Box p="lg" pb={100}>
          {/* Section 1: Event Description & Location */}
          <EventCard event={event} withTitle={false} />

          <Divider my="sm" />

          {/* Section 2: Other Entities (Overflow) */}
          <SimpleGrid cols={2} spacing="xl">
            {/* Organizations */}
            <Stack gap="xs">
              <Text fw={600}>{t('entity.event.Window.relatedOrganizations')}</Text>
              <AvatarSpan>
                {organizations.map(({ entity, relation }) => (
                  <OrganizationAvatar key={entity.key} data={entity} relation={relation} />
                ))}
              </AvatarSpan>
            </Stack>

            {/* Websites */}
            <Stack gap="xs">
              <Text fw={600}>{t('entity.event.Window.relatedWebsites')}</Text>
              <AvatarSpan>
                {websites.map(({ entity, relation }) => (
                  <WebsiteAvatar key={entity.key} data={entity} relation={relation} />
                ))}
              </AvatarSpan>
            </Stack>
          </SimpleGrid>

          {/* Full Sources List */}
          <Stack gap="xs" mt="md">
            <Text fw={600}>{t('entity.event.Window.relatedSources')}</Text>
            <Stack gap="xs">
              {sources.map(({ entity, relation }) => (
                <SourceAvatarRow width={400} key={entity.key} data={entity} relation={relation} />
              ))}
            </Stack>
          </Stack>
        </Box>
      </ScrollArea>

      {/* B. STICKY BOTTOM LEFT: PERSONS */}
      <Box style={{ position: 'absolute', bottom: 15, left: 15, zIndex: 10 }}>
        <AvatarSpan>
          {persons.map(({ entity, relation }) => (
            <PersonAvatar key={entity.key} data={entity} relation={relation} />
          ))}
        </AvatarSpan>
      </Box>

      {/* C. FLYOUT TOP RIGHT: SOURCES */}
      <Box style={{ position: 'absolute', top: 15, right: 15, zIndex: 10 }}>
        <AvatarDropdown avatarOnOpen={<ChevronDownIcon />} avatarOnClose={<LinkIcon />}>
          {sources.map(({ entity, relation }) => (
            <SourceAvatar width={400} key={entity.key} data={entity} relation={relation} />
          ))}
        </AvatarDropdown>
      </Box>
    </WindowModal>
  );
};
