import React, { useState } from 'react';
import { Paper, Stack, Group, Text, Divider, Title, Collapse, UnstyledButton } from '@mantine/core';
import { type MonitoringSource, type MonitoringSourceMainData } from 'omni-monitoring-client';
import { useTranslation } from 'react-i18next';
import {
  EditableTitle,
  EditableText,
  EditableTextarea,
  EditableSelect,
  EditableNumber,
  EditableDate,
  EditableAttributes,
} from '../fields';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

interface Props {
  source: MonitoringSource;
  onUpdate?: (data: MonitoringSourceMainData) => void;
}

export const MonitoringSourceForm: React.FC<Props> = ({ source, onUpdate }) => {
  const { t } = useTranslation();
  const [attributesOpen, setAttributesOpen] = useState(false);

  return (
    <Paper withBorder p="md" radius="md">
      <Stack>
        <EditableTitle
          value={source.name || ''}
          onChange={(val) => onUpdate?.({ name: val })}
          canEdit={!!onUpdate}
          placeholder={t('monitoring.source.name')}
          order={4}
        />

        <EditableTextarea
          value={source.description || ''}
          onChange={(val) => onUpdate?.({ description: val })}
          canEdit={!!onUpdate}
          placeholder={t('monitoring.source.description')}
        />

        <Group>
          <Text>{t('monitoring.source.type')}:</Text>
          <EditableSelect
            value={source.type || ''}
            onChange={(val) => onUpdate?.({ type: val as any })}
            canEdit={!!onUpdate}
            data={['website', 'twitter', 'telegram']}
            placeholder={t('monitoring.source.type')}
          />
        </Group>
        <Group>
          <Text>{t('monitoring.source.url')}:</Text>
          <EditableText
            value={source.url || ''}
            onChange={(val) => onUpdate?.({ url: val })}
            canEdit={!!onUpdate}
            placeholder={t('monitoring.source.url')}
          />
        </Group>

        <Group>
          <Text>{t('monitoring.source.reliability')}:</Text>
          <EditableNumber
            value={source.reliability || 0}
            onChange={(val) => onUpdate?.({ reliability: Number(val) })}
            canEdit={!!onUpdate}
            placeholder={t('monitoring.source.reliability')}
          />
        </Group>
        <Group>
          <Text>{t('monitoring.source.lastReviewed')}:</Text>
          <EditableDate
            value={(source.last_reviewed || 0) * 1000}
            onChange={(date) => onUpdate?.({ last_reviewed: date.getTime() / 1000 })}
            canEdit={!!onUpdate}
            placeholder={t('monitoring.source.lastReviewed')}
          />
        </Group>

        <Divider my="sm" />

        <UnstyledButton onClick={() => setAttributesOpen((o) => !o)}>
          <Group justify="space-between">
            <Title order={5}>{t('monitoring.source.attributes')}</Title>
            <ChevronDownIcon
              style={{
                width: 16,
                transform: attributesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 200ms ease',
              }}
            />
          </Group>
        </UnstyledButton>

        <Collapse in={attributesOpen}>
          <EditableAttributes
            value={source.attributes || {}}
            onChange={(val: Record<string, any>) => onUpdate?.({ attributes: val })}
            canEdit={!!onUpdate}
          />
        </Collapse>
      </Stack>
    </Paper>
  );
};
