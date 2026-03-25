import React from 'react';
import { Box, Group, ScrollArea, Text, Title } from '@mantine/core';
import { useMonitorStore } from './monitorData';
import { MonitoringSourceForm } from '../../../components/forms/MonitoringSourceForm';
import { updateMonitoringSource } from 'omni-monitoring-client';
import { useTranslation } from 'react-i18next';
import { useDataOwner } from '../../../provider/AuthContext';

const MonitorWindowContent: React.FC = () => {
  const { t } = useTranslation();
  const { selected } = useMonitorStore();
  const isOwner = useDataOwner(selected);

  const handleUpdate = (data: any) => {
    if (!selected?._id) return;
    updateMonitoringSource({
      body: data,
      path: {
        id: selected._id,
      },
    });
  };

  if (!selected) {
    return (
      <Group justify="center" align="center" style={{ flex: 1 }}>
        <Text>{t('pages.windows.monitor.MonitorWindow.noSourceSelected', '?')}</Text>
      </Group>
    );
  }

  return (
    <ScrollArea h="100%" w="100%" type="scroll" offsetScrollbars p="md">
      <MonitoringSourceForm
        source={selected}
        onUpdate={isOwner ? handleUpdate : undefined}
        onClose={() => {}}
      />
    </ScrollArea>
  );
};

export const MonitorWindow: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box pos="relative" h="100%" w="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Box p="lg" pb={0}>
        <Title order={3}>{t('pages.windows.monitor.MonitorWindow.title', '?')}</Title>
      </Box>
      <MonitorWindowContent />
    </Box>
  );
};
