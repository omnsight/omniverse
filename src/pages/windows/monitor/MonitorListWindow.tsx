import React, { useEffect } from 'react';
import { ActionIcon, Box, Button, Group, Loader, ScrollArea, Stack, Title } from '@mantine/core';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import {
  createMonitoringSource,
  getMonitoringSourcesByUser,
  type MonitoringSource,
} from 'omni-monitoring-client';
import { useMonitorStore } from './monitorData';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useWindowManager } from '../WindowManager';
import { notifications } from '@mantine/notifications';
import { useMonitoringClient } from '../../../api/useMonitoringClient';
import { MonitoringSourceCard } from '@omnsight/osint-entity-components/cards';
import { MonitoringSourceForm } from '@omnsight/osint-entity-components/forms';

const MonitorListWindowContent: React.FC = () => {
  const { t } = useTranslation();
  const { monitoringClient } = useMonitoringClient();
  const { sources, setSources, setSelected } = useMonitorStore();
  const { setActiveWindowByName } = useWindowManager();
  const [creating, setCreating] = React.useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['monitoring-sources'],
    queryFn: async () => {
      const response = await getMonitoringSourcesByUser({
        client: monitoringClient,
      });
      console.log('Fetched sources', response.data);
      return response.data;
    },
  });

  useEffect(() => {
    if (isError) {
      console.error('Error fetching sources data', error);
      notifications.show({
        title: t('common.error'),
        message: t('pages.windows.monitor.MonitorListWindow.getSourcesError'),
        color: 'red',
      });
    }
  }, [isError, error, t]);

  useEffect(() => {
    if (data) {
      setSources(data);
    }
  }, [data, setSources]);

  const submitNewSource = async (ms: MonitoringSource) => {
    const { data, error } = await createMonitoringSource({
      client: monitoringClient,
      body: ms,
    });

    if (error) {
      console.error('Error creating source', error);
      notifications.show({
        title: t('common.error'),
        message: t('pages.windows.monitor.MonitorListWindow.createSourceError'),
        color: 'red',
      });
      return;
    }

    console.log('Created monitoring source', data);
    setSources([...sources, data]);
    setCreating(false);
    queryClient.invalidateQueries({ queryKey: ['monitoring-sources'] });
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
            <MonitoringSourceCard
              key={source._id || ''}
              monitoringSource={source}
              action={
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(source);
                    setActiveWindowByName('Monitor');
                  }}
                >
                  <ArrowRightIcon style={{ width: 18, height: 18 }} />
                </ActionIcon>
              }
            />
          ))}
          {creating ? (
            <MonitoringSourceForm
              source={{} as MonitoringSource}
              onSubmit={submitNewSource}
              onClose={() => setCreating(false)}
            />
          ) : (
            <Button
              fullWidth
              data-testid="add-monitoring-source-button"
              onClick={() => setCreating(true)}
            >
              <PlusIcon style={{ width: 20, height: 20 }} />
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
        <Title order={3}>{t('pages.windows.monitor.MonitorListWindow.title')}</Title>
      </Box>
      <MonitorListWindowContent />
    </Box>
  );
};
