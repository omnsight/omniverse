import React from 'react';
import { Box, ScrollArea, SimpleGrid, Text } from '@mantine/core';
import { useEntityDataStore } from '../network/entityData';
import { useEntitySelectionActions } from './entitySelection';
import { useDataWindowManagerActions } from './windowManager';
import { EventForm } from '../../../components/forms';
import { useTranslation } from 'react-i18next';

export const EntityListWindow: React.FC = () => {
  const { t } = useTranslation();
  const { events } = useEntityDataStore();
  const { setActiveWindowByName } = useDataWindowManagerActions();
  const { setSelections } = useEntitySelectionActions();

  if (events.length === 0) {
    return (
      <Box style={{ height: '100%', width: '100%', position: 'relative' }}>
        <Text>{t('data.entity.list.noEntities')}</Text>
      </Box>
    );
  }

  return (
    <Box style={{ height: '100%', width: '100%', position: 'relative' }}>
      <ScrollArea h="100%" type="scroll" offsetScrollbars>
        <Box p="lg">
          <SimpleGrid cols={3} spacing="xl">
            {events.map((entity) => (
              <Box key={entity._id}>
                <EventForm
                  event={entity}
                  onClick={() => {
                    setSelections([entity._id || '']);
                    setActiveWindowByName('Entity');
                  }}
                />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </ScrollArea>
    </Box>
  );
};
