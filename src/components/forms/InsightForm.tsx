import React, { type PropsWithChildren } from 'react';
import { Paper, Stack, Text } from '@mantine/core';
import type { OsintView, OsintViewMainData } from 'omni-osint-crud-client';
import { EditableTextarea, EditableTitle } from '../fields';
import { useTranslation } from 'react-i18next';

interface InsightFormProps extends PropsWithChildren {
  insight: OsintView;
  useLabel: boolean;
  useInput: boolean;
  onUpdate?: (data: OsintViewMainData) => void;
}

export const InsightForm: React.FC<InsightFormProps> = ({
  insight,
  useLabel,
  useInput,
  onUpdate,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <Paper pos="relative" p="md" shadow="sm" withBorder>
      <Stack>
        {useLabel && (
          <Text size="sm" fw={500}>
            {t('placeholder.title')}
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
            {t('placeholder.description')}
          </Text>
        )}
        <EditableTextarea
          value={insight.description || ''}
          onChange={(val) => onUpdate?.({ description: val })}
          useInput={useInput}
          canEdit={!!onUpdate}
          placeholder={t('components.forms.InsightForm.insightDescriptionPlaceholder')}
        />
      </Stack>
      {children}
    </Paper>
  );
};
