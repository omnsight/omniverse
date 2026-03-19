import React from 'react';
import { Paper, Stack } from '@mantine/core';
import type { OsintView, OsintViewMainData } from 'omni-osint-crud-client';
import { EditableTextarea, EditableTitle } from '../fields';
import { useTranslation } from 'react-i18next';

interface InsightFormProps {
  insight: OsintView;
  onUpdate?: (data: OsintViewMainData) => void;
}

export const InsightForm: React.FC<InsightFormProps> = ({ insight, onUpdate }) => {
  const { t } = useTranslation();

  return (
    <Paper p="md" shadow="sm" withBorder>
      <Stack>
        <EditableTitle
          value={insight.name || ''}
          onChange={(val) => onUpdate?.({ name: val })}
          canEdit={!!onUpdate}
          placeholder={t('insight.name')}
          order={4}
        />

        <EditableTextarea
          value={insight.description || ''}
          onChange={(val) => onUpdate?.({ description: val })}
          canEdit={!!onUpdate}
          placeholder={t('insight.description')}
        />
      </Stack>
    </Paper>
  );
};
