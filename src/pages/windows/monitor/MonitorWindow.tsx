import React from 'react';
import { Box, ScrollArea, Text } from '@mantine/core';
import { useMonitorStore } from './monitorData';
import { MonitoringSourceForm } from '../../../components/forms/MonitoringSourceForm';
import { MonitoringSourcesService } from 'omni-monitoring-client';
import { useTranslation } from 'react-i18next';
import { useDataOwner } from '../../../provider/AuthContext';

export const MonitorWindow: React.FC = () => {
  const { t } = useTranslation();
  const { selected } = useMonitorStore();
  const isOwner = useDataOwner(selected);

  const handleUpdate = (data: any) => {
    if (!selected?._id) return;
    MonitoringSourcesService.updateMonitoringSource(selected._id, data);
  };

  if (!selected) {
    return (
      <Box pos="relative" h="100%" w="100%">
        <Text>{t('monitoring.single.noSourceSelected')}</Text>
      </Box>
    );
  }

  return (
    <Box pos="relative" h="100%" w="100%">
      <ScrollArea h="100%" w="100%" type="scroll" offsetScrollbars p="md">
        <MonitoringSourceForm source={selected} onUpdate={isOwner ? handleUpdate : undefined} />
      </ScrollArea>
    </Box>
  );
};
