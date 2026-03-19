import React from 'react';
import { Paper, Stack, Text } from '@mantine/core';
import type { OsintView, OsintViewMainData } from 'omni-osint-crud-client';
import { EditableTextarea, EditableTitle } from '../fields';
import { useTranslation } from 'react-i18next';

interface InsightFormProps {
  insight: OsintView;
  useLabel: boolean;
  useInput: boolean;
  onUpdate?: (data: OsintViewMainData) => void;
  onClick?: () => void;
}

export const InsightForm: React.FC<InsightFormProps> = ({
  insight,
  useLabel,
  useInput,
  onUpdate,
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <Paper
      p="md"
      shadow="sm"
      withBorder
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Stack>
        {useLabel && (
          <Text size="sm" fw={500}>
            {t('components.insightForm.title')}
          </Text>
        )}
        <EditableTitle
          value={insight.name || ''}
          onChange={(val) => onUpdate?.({ name: val })}
          useInput={useInput}
          canEdit={!!onUpdate}
          placeholder={t('placeholder.title')}
          order={4}
        />

        {useLabel && (
          <Text size="sm" fw={500}>
            {t('components.insightForm.description')}
          </Text>
        )}
        <EditableTextarea
          value={insight.description || ''}
          onChange={(val) => onUpdate?.({ description: val })}
          useInput={useInput}
          canEdit={!!onUpdate}
          placeholder={t('placeholder.description')}
        />
      </Stack>
    </Paper>
  );
};
