import React from 'react';
import { Stack, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { type Relation, type RelationMainData } from 'omni-osint-crud-client';
import { EditableNumber, EditableTitle, EditableText } from '../fields';

interface Props {
  relation: Relation;
  onUpdate?: (data: RelationMainData) => void;
  onClick?: () => void;
}

export const RelationForm: React.FC<Props> = ({ relation, onUpdate, onClick }) => {
  const { t } = useTranslation();

  return (
    <Stack
      gap="xs"
      style={{ position: 'relative', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <EditableTitle
        value={relation.label || ''}
        onChange={(val) => onUpdate?.({ label: val })}
        canEdit={!!onUpdate}
        placeholder={t('entity.relation.name')}
        order={4}
      />

      <Group gap={4}>
        <Text size="sm">{t('entity.relation.name')}:</Text>
        <EditableText
          value={relation.name || ''}
          onChange={(val) => onUpdate?.({ name: val })}
          canEdit={!!onUpdate}
          placeholder={t('entity.relation.name')}
        />
      </Group>

      <Group gap={4}>
        <Text size="sm">{t('placeholder.confidence')}:</Text>
        <EditableNumber
          value={relation.confidence ?? 0}
          onChange={(val) => onUpdate?.({ confidence: Number(val) })}
          canEdit={!!onUpdate}
          placeholder={t('placeholder.confidence')}
        />
      </Group>
    </Stack>
  );
};
