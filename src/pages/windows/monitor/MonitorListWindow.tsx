import React, { useEffect } from 'react';
import { ActionIcon, Box, Group, Loader, ScrollArea, Stack, Title } from '@mantine/core';
import { getMonitoringSourcesByUser } from 'omni-monitoring-client';
import { useMonitorStore } from './monitorData';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useWindowManager } from '../WindowManager';
import { notifications } from '@mantine/notifications';
import { useMonitoringClient } from '../../../api/useMonitoringClient';
import { MonitoringSourceCard } from '@omnsight/osint-entity-components/cards';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const MonitorListWindowContent: React.FC = () => {
  const { t } = useTranslation();
  const { monitoringClient } = useMonitoringClient();
  const { sources, setSources, setSelected } = useMonitorStore();
  const { setActiveWindowByName } = useWindowManager();

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
        message: t('pages.windows.monitor.MonitorListWindow.getSourcesError', '?'),
        color: 'red',
      });
    }
  }, [isError, error, t]);

  useEffect(() => {
    if (data) {
      setSources(data);
    }
  }, [data, setSources]);

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
