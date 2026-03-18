import React from 'react';
import { Box, ScrollArea, SimpleGrid, Text } from '@mantine/core';
import { useEntityDataStore } from '../network/entityData';
import { useEntitySelectionActions } from './entitySelection';
import { EventForm } from '../../../components/forms';
import { useTranslation } from 'react-i18next';
import { useWindowManager } from '../WindowManager';

export const EntityListWindow: React.FC = () => {
  const { t } = useTranslation();
  const { events } = useEntityDataStore();
  const { setActiveWindowByName } = useWindowManager();
  const { setSelections } = useEntitySelectionActions();

  if (events.length === 0) {
    return (
      <Box pos="relative" h="100%" w="100%">
        <Text>{t('data.entity.list.noEvents')}</Text>
      </Box>
    );
  }

  return (
    <Box pos="relative" h="100%" w="100%">
      <ScrollArea h="100%" w="100%" type="scroll" offsetScrollbars>
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
