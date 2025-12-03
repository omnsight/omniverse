import React, { useEffect, useState } from 'react';
import { Modal, Box, Breadcrumbs, Anchor, ActionIcon, Group, Text, ScrollArea, useMantineTheme, rem } from '@mantine/core';
import { XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import type { V1Event, V1RelatedEntity } from '@omnsight/clients/dist/geovision/geovision.js';
import { EventWindowPageOne } from './EventWindowPageOne';
import { EventWindowPageTwo, type PageTwoContext } from './EventWindowPageTwo';
import { useAppStore } from '../../utilties/useAppStore';

interface EventWindowProps {
  isOpen: boolean;
  onClose: () => void;
  event: V1Event;
}

export const EventWindow: React.FC<EventWindowProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const theme = useMantineTheme();
  const { geoApi } = useAppStore();
  const [relatedEntities, setRelatedEntities] = useState<V1RelatedEntity[]>([]);
  const [pageTwo, setPageTwo] = useState<PageTwoContext | null>(null);

  useEffect(() => {
    if (event.key) {
      geoApi.v1.geoServiceGetEventRelatedEntities(event.key).then((response) => {
        setRelatedEntities(response.data.entities || []);
      });
    }
  }, [event.key]);

  const handleSave = () => { console.log('Saving...'); };

  // Helper to get display name for breadcrumbs
  const getEntityName = (entity: V1RelatedEntity) => {
    return entity.person?.name || entity.organization?.name || entity.source?.name || entity.website?.domain || 'New Entity';
  };

  return (
    <Modal 
      opened={isOpen} 
      onClose={onClose} 
      size="lg" 
      padding={0} 
      withCloseButton={false}
      styles={{
        body: { height: '80vh', display: 'flex', flexDirection: 'column' }
      }}
    >
      {/* 1. STICKY HEADER */}
      <Box p="md" style={{ borderBottom: `1px solid ${theme.colors.gray[2]}` }}>
        <Group justify="space-between" mb={5}>
          <Breadcrumbs separator=">">
            <Anchor component="button" size="sm" onClick={() => setPageTwo(null)}>
              Event: {event.title || 'Untitled Event'}
            </Anchor>
            {pageTwo && (
              <Text size="sm" c="dimmed">
                {pageTwo.mode === 'create' ? 'New Relation' : getEntityName(pageTwo.entity)}
              </Text>
            )}
          </Breadcrumbs>

          <Group gap="xs">
            {pageTwo && (
              <ActionIcon onClick={() => setPageTwo(null)} variant="light">
                <ArrowLeftIcon style={{ width: rem(20), height: rem(20) }} />
              </ActionIcon>
            )}
            <ActionIcon onClick={onClose} variant="subtle" color="red">
              <XMarkIcon style={{ width: rem(20), height: rem(20) }} />
            </ActionIcon>
          </Group>
        </Group>
      </Box>

      {/* 2. BODY CONTENT */}
      <Box style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {!pageTwo ? (
          <EventWindowPageOne
            event={event}
            relatedEntities={relatedEntities}
            onNavigate={(relatedEntity) => setPageTwo({ mode: 'view', entity: relatedEntity })}
            onCreate={(newEntity) => setPageTwo({ mode: 'create', entity: newEntity })}
          />
        ) : (
          <ScrollArea h="100%">
             <EventWindowPageTwo context={pageTwo} onSave={handleSave} />
          </ScrollArea>
        )}
      </Box>
    </Modal>
  );
};