import { Group, Paper, Text, Tooltip } from '@mantine/core';
import { type MonitoringSource } from 'omni-monitoring-client';
import { useTranslation } from 'react-i18next';
import React from 'react';

interface Props {
  source: MonitoringSource;
  action?: React.ReactNode;
}

export const MonitoringSourceSummaryCard: React.FC<Props> = ({ source, action }) => {
  const { t } = useTranslation();

  return (
    <Paper withBorder p="xs">
      <Group justify="space-between" wrap="nowrap">
        <Tooltip label={source.description || t('placeholder.description')}>
          <Text truncate="end">{source.name || t('components.cards.MonitoringSourceSummaryCard.title', '?')}</Text>
        </Tooltip>
        {action}
      </Group>
    </Paper>
  );
};
