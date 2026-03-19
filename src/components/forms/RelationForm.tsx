import React, { useState } from 'react';
import { Stack, Group, Text, Divider, UnstyledButton, Collapse, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { type Relation, type RelationMainData } from 'omni-osint-crud-client';
import { EditableNumber, EditableTitle, EditableText, EditableAttributes } from '../fields';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Props {
  relation: Relation;
  onUpdate?: (data: RelationMainData) => void;
  onClick?: () => void;
}

export const RelationForm: React.FC<Props> = ({ relation, onUpdate, onClick }) => {
  const { t } = useTranslation();
  const [attributesOpen, setAttributesOpen] = useState(false);

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
        placeholder={t('components.entity.relation.label')}
        order={4}
      />

      <Group gap={4}>
        <Text size="sm">{t('placeholder.name')}:</Text>
        <EditableText
          value={relation.name || ''}
          onChange={(val) => onUpdate?.({ name: val })}
          canEdit={!!onUpdate}
          placeholder={t('placeholder.name')}
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

      <Divider my="sm" />

      <UnstyledButton onClick={() => setAttributesOpen((o) => !o)}>
        <Group justify="space-between">
          <Title order={5}>{t('placeholder.attributes')}</Title>
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
          value={relation.attributes || {}}
          onChange={(val: Record<string, any>) => onUpdate?.({ attributes: val })}
          canEdit={!!onUpdate}
        />
      </Collapse>
    </Stack>
  );
};
