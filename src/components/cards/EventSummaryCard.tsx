import { Group, Paper, Text, Tooltip } from '@mantine/core';
import { type Event } from 'omni-osint-crud-client';
import { useTranslation } from 'react-i18next';
import React from 'react';

interface Props {
  event: Event;
  action?: React.ReactNode;
}

export const EventSummaryCard: React.FC<Props> = ({ event, action }) => {
  const { t } = useTranslation();

  return (
    <Paper withBorder p="xs">
      <Group justify="space-between" wrap="nowrap">
        <Tooltip label={event.description || t('placeholder.description')}>
          <Text truncate="end">{event.title || t('placeholder.title')}</Text>
        </Tooltip>
        {action}
      </Group>
    </Paper>
  );
};
