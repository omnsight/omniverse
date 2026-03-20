import React, { useEffect, useState } from 'react';
import { Box, Button, Group, Loader, ScrollArea, Stack, Title } from '@mantine/core';
import {
  type MonitoringSource,
  type MonitoringSourceMainData,
  getMonitoringSourcesByUser,
  createMonitoringSource,
} from 'omni-monitoring-client';
import { useMonitorStore } from './monitorData';
import { MonitoringSourceForm } from '../../../components/forms';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useWindowManager } from '../WindowManager';
import { notifications } from '@mantine/notifications';
import { InputWindow } from '../../../components/modals/InputWindow';
import { useAuth } from '../../../provider/AuthContext';

const MonitorListWindowContent: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { sources, setSources, setSelected } = useMonitorStore();
  const { setActiveWindowByName } = useWindowManager();
  const [sourceToCreate, setSourceToCreate] = useState<MonitoringSource | undefined>(undefined);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['monitoring-sources'],
    queryFn: () => getMonitoringSourcesByUser(),
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
    if (data?.data) {
      setSources(data?.data);
    }
  }, [data, setSources]);

  const updateSource = (data: MonitoringSourceMainData) => {
    if (!sourceToCreate) return;
    setSourceToCreate({
      ...sourceToCreate,
      ...data,
    });
  };

  const createSource = async () => {
    if (!sourceToCreate) return;

    const { data, error } = await createMonitoringSource({
      body: sourceToCreate,
    });
    if (error) {
      console.error('Error creating source', error);
      notifications.show({
        title: t('common.error'),
        message: t('monitoring.create.error'),
        color: 'red',
      });
    } else {
      setSources([...sources, data]);
      setSourceToCreate(undefined);
      console.log('Created source', data);
    }
  };

  if (isLoading) {
    return (
      <Group justify="center" align="center" style={{ flex: 1 }}>
        <Loader />
      </Group>
    );
  }

  return (
    <ScrollArea h="100%" w="100%" type="scroll" offsetScrollbars>
      <Box p="lg" pt="sm">
        <Stack>
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
          {sourceToCreate ? (
            <InputWindow
              title={t('monitoring.create.title')}
              cancel={t('common.cancel')}
              submit={t('common.create')}
              onClose={() => setSourceToCreate(undefined)}
              onSubmit={createSource}
            >
              <MonitoringSourceForm source={sourceToCreate} onUpdate={updateSource} />
            </InputWindow>
          ) : (
            <Button onClick={() => setSourceToCreate({ owner: user?.id || '' })}>
              {t('monitoring.create.title')}
            </Button>
          )}
        </Stack>
      </Box>
    </ScrollArea>
  );
};

export const MonitorListWindow: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box pos="relative" h="100%" w="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Box p="lg" pb={0}>
        <Title order={3}>{t('monitoring.list.title')}</Title>
      </Box>
      <MonitorListWindowContent />
    </Box>
  );
};
