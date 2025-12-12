import React from 'react';
import { Box, ScrollArea, Divider, SimpleGrid, Switch } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { V1Event, V1RelatedEntity } from '@omnsight/clients/dist/geovision/geovision.js';
import { PersonList } from './entities/PersonEntity';
import { OrganizationList } from './entities/OrganizationEntity';
import { WebsiteList } from './entities/WebsiteEntity';
import { SourceList } from './entities/SourceEntity';
import { EventEntity } from './entities/EventEntity';
import { useAuth } from '../../utilties/AuthProvider';

interface EventWindowPageOneProps {
  event: V1Event;
  relatedEntities: V1RelatedEntity[];
  onNavigate: (entity: V1RelatedEntity) => void;
  onCreate: (entity: V1RelatedEntity) => void;
  isEditMode: boolean;
  onEditModeChange: (isEdit: boolean) => void;
}

export const EventWindowPageOne: React.FC<EventWindowPageOneProps> = ({
  event,
  relatedEntities,
  onNavigate,
  onCreate,
  isEditMode,
  onEditModeChange
}) => {
  const { t } = useTranslation();
  const { hasRole } = useAuth();

  const canEdit = hasRole('admin');

  const personEntities = relatedEntities.filter(e => e.person);
  const orgEntities = relatedEntities.filter(e => e.organization);
  const websiteEntities = relatedEntities.filter(e => e.website);
  const sourceEntities = relatedEntities.filter(e => e.source);

  return (
    <>
      {/* A. SCROLLABLE BODY */}
      <ScrollArea h="100%" type="scroll" offsetScrollbars>
        <Box p="lg" pb={100}>
          {/* Section 1: Event Description & Location */}
          <EventEntity event={event} withTitle={false} />

          <Divider my="sm" />

          {/* Section 2: Other Entities (Overflow) */}
          <SimpleGrid cols={2} spacing="xl">
            {/* Organizations */}
            <OrganizationList
              items={orgEntities}
              onSelect={onNavigate}
              onCreate={onCreate}
              readOnly={!isEditMode}
              variant={'avatar'}
            />

            {/* Websites */}
            <WebsiteList
              items={websiteEntities}
              onSelect={onNavigate}
              onCreate={onCreate}
              readOnly={!isEditMode}
              variant={'avatar'}
            />
          </SimpleGrid>

          {/* Full Sources List */}
          <SourceList
            items={sourceEntities}
            onSelect={onNavigate}
            onCreate={onCreate}
            readOnly={!isEditMode}
            variant={'avatar'}
          />
        </Box>
      </ScrollArea>

      {/* B. STICKY BOTTOM LEFT: PERSONS */}
      <Box style={{ position: 'absolute', bottom: 15, left: 15, zIndex: 10 }}>
        <PersonList
          items={personEntities}
          onSelect={onNavigate}
          onCreate={onCreate}
          readOnly={!isEditMode}
          variant={'avatar'}
        />
      </Box>

      {/* C. FLYOUT TOP RIGHT: SOURCES */}
      {sourceEntities && sourceEntities.length > 0 &&
        <Box style={{ position: 'absolute', top: 15, right: 15, zIndex: 10 }}>
          <SourceList
            items={sourceEntities}
            onSelect={onNavigate}
            onCreate={onCreate}
            readOnly={!isEditMode}
            variant="popover"
          />
        </Box>
      }

      {/* D. STICKY BOTTOM RIGHT: EDIT TOGGLE */}
      {canEdit && (
        <Box style={{ position: 'absolute', bottom: 15, right: 15, zIndex: 10 }}>
          <Switch
            label={t('common.editMode')}
            checked={isEditMode}
            onChange={(event) => onEditModeChange(event.currentTarget.checked)}
            styles={{ label: { color: 'var(--mantine-color-dimmed)' } }}
          />
        </Box>
      )}
    </>
  );
};