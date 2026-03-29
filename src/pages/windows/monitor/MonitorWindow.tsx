import { truncate } from 'lodash';
import React from 'react';
import {
  Box,
  ScrollArea,
  Text,
  Group,
  Breadcrumbs,
  Tooltip,
  Anchor,
} from '@mantine/core';
import { useMonitorStore } from './monitorData';
import { MonitoringSourceForm } from '@omnsight/osint-entity-components/forms';
import { updateMonitoringSource } from 'omni-monitoring-client';
import { useTranslation } from 'react-i18next';
import { useDataOwner } from '../../../provider/AuthContext';
import { useWindowManager } from '../WindowManager';

const MonitorWindowContent: React.FC<{ selected: any }> = ({ selected }) => {
  const { t } = useTranslation();
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
        <Text>{t('pages.windows.monitor.MonitorWindow.noSourceSelected')}</Text>
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
  const { selected } = useMonitorStore();
  const { setActiveWindowByName } = useWindowManager();

  const breadcrumbs = [
    <Anchor href="#" onClick={() => setActiveWindowByName('MonitorList')} key="1">
      {t('pages.windows.monitor.MonitorWindow.title')}
    </Anchor>,
  ];
  if (selected) {
    breadcrumbs.push(
      <Tooltip label={selected.name} withArrow>
        <Text key="2" truncate="end" style={{ maxWidth: 200 }}>
          {truncate(selected.name || '', { length: 20 })}
        </Text>
      </Tooltip>
    );
  }

  return (
    <Box pos="relative" h="100%" w="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Box p="lg" pb={0}>
        <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
      </Box>
      <MonitorWindowContent selected={selected} />
    </Box>
  );
};
