import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, ScrollArea, SimpleGrid, Text } from '@mantine/core';
import {
  type MonitoringSource,
  type MonitoringSourceMainData,
  MonitoringSourcesService,
} from 'omni-monitoring-client';
import { useMonitorStore } from './monitorData';
import { MonitoringSourceForm } from '../../../components/forms';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useWindowManager } from '../WindowManager';
import { notifications } from '@mantine/notifications';

export const MonitorListWindow: React.FC = () => {
  const { t } = useTranslation();
  const { sources, setSources, setSelected } = useMonitorStore();
  const { setActiveWindowByName } = useWindowManager();
  const [sourceToCreate, setSourceToCreate] = useState<Partial<MonitoringSource> | undefined>(
    undefined,
  );

  const {
    data: fetchedSources,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['monitoring-sources'],
    queryFn: () => MonitoringSourcesService.getMonitoringSourcesByUser(),
  });

  useEffect(() => {
    if (isError) {
      console.error('Error fetching sources data', error);
      notifications.show({
        title: t('common.error'),
        message: t('monitoring.list.getSourcesError'),
        color: 'red',
      });
    }
  }, [isError, error, t]);

  useEffect(() => {
    if (fetchedSources) {
      setSources(fetchedSources);
    }
  }, [fetchedSources, setSources]);

  const updateSource = (data: MonitoringSourceMainData) => {
    if (!sourceToCreate) return;
    setSourceToCreate({
      ...sourceToCreate,
      ...data,
    });
  };

  const createSource = async () => {
    if (!sourceToCreate) return;
    try {
      const source = await MonitoringSourcesService.createMonitoringSource(sourceToCreate);
      setSources([...sources, source]);
      setSourceToCreate(undefined);
      console.log('Created source', source);
    } catch (error) {
      console.error('Error creating source', error);
      notifications.show({
        title: t('common.error'),
        message: t('monitoring.create.error'),
        color: 'red',
      });
    }
  };

  if (sources.length === 0) {
    return (
      <Box pos="relative" h="100%" w="100%">
        {isLoading ? (
          <Text>{t('common.loading')}</Text>
        ) : (
          <Box>
            <Text>{t('monitoring.list.noSources')}</Text>
            <Button onClick={() => setSourceToCreate({})}>{t('monitoring.create.title')}</Button>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box pos="relative" h="100%" w="100%">
      <ScrollArea h="100%" w="100%" type="scroll" offsetScrollbars>
        <Box p="lg">
          <Button onClick={() => setSourceToCreate({})}>{t('monitoring.create.title')}</Button>
          <SimpleGrid cols={3} spacing="xl" mt="md">
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
      <Modal
        opened={!!sourceToCreate}
        onClose={() => setSourceToCreate(undefined)}
        title={t('monitoring.create.title')}
      >
        {sourceToCreate && (
          <MonitoringSourceForm
            source={sourceToCreate as MonitoringSource}
            onUpdate={updateSource}
          />
        )}
        <Button onClick={createSource}>{t('monitoring.create.submit')}</Button>
      </Modal>
    </Box>
  );
};
