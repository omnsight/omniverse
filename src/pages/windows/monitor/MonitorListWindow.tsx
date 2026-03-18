import React, { useEffect } from 'react';
import { Box, ScrollArea, SimpleGrid, Text } from '@mantine/core';
import { MonitoringSourcesService } from 'omni-monitoring-client';
import { useMonitorStore } from './monitorData';
import { MonitoringSourceForm } from '../../../components/forms';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useWindowManager } from '../WindowManager';

export const MonitorListWindow: React.FC = () => {
  const { t } = useTranslation();
  const { sources, setSources, setSelected } = useMonitorStore();
  const { setActiveWindowByName } = useWindowManager();

  const { data: fetchedSources, isLoading } = useQuery({
    queryKey: ['monitoring-sources'],
    queryFn: () => MonitoringSourcesService.getMonitoringSourcesByUser(),
  });

  useEffect(() => {
    if (fetchedSources) {
      setSources(fetchedSources);
    }
  }, [fetchedSources, setSources]);

  if (sources.length === 0) {
    return (
      <Box pos="relative" h="100%" w="100%">
        {isLoading ? <Text>{t('loading')}</Text> : <Text>{t('monitoring.list.noSources')}</Text>}
      </Box>
    );
  }

  return (
    <Box pos="relative" h="100%" w="100%">
      <ScrollArea h="100%" w="100%" type="scroll" offsetScrollbars>
        <Box p="lg">
          <SimpleGrid cols={3} spacing="xl">
            {sources.map((source) => (
              <Box
                key={source._id}
                onClick={() => {
                  setSelected(source);
                  setActiveWindowByName('Monitor');
                }}
              >
                <MonitoringSourceForm source={source} />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </ScrollArea>
    </Box>
  );
};
