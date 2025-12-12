import React from 'react';
import { Stack, Group, Text, TextInput, NumberInput, Textarea, Box, rem, RingProgress } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { V1Relation } from '@omnsight/clients/dist/geovision/geovision';

interface RelationCardProps {
  data: V1Relation;
  edit: boolean;
  onChange?: (data: Partial<V1Relation>) => void;
}

export const RelationCard: React.FC<RelationCardProps> = ({ data, edit, onChange }) => {
  const { t } = useTranslation();

  if (!edit) {
    return (
      <Stack gap="xs">
        <Group>
          <Text size="sm">{t('common.type')}:</Text>
          <Text>{data.name || t('common.unknown')}</Text>
        </Group>
        <Group>
          <Text size="sm">{t('common.confidence')}:</Text>
          <Text>{data.confidence || 0}%</Text>
        </Group>
      </Stack>
    );
  } else {
    return (
      <Stack>
        <TextInput
          label={t('common.relationType')}
          defaultValue={data?.name}
          placeholder={t('common.enterRelationType')}
          onChange={(e) => onChange?.({ name: e.target.value })}
        />
        <NumberInput
          label={t('common.confidence')}
          defaultValue={data?.confidence}
          placeholder={t('common.enterConfidence')}
          onChange={(val) => onChange?.({ confidence: Number(val) })}
        />
        <Textarea
          label={t('common.notes')}
          autosize
          minRows={2}
          placeholder={t('common.enterNotes')}
        />
      </Stack>
    );
  }
};

interface RelationTooltipProps {
  relation?: V1Relation;
  children: React.ReactNode;
}

export const RelationTooltip: React.FC<RelationTooltipProps> = ({ relation, children }) => {
  const { t } = useTranslation();
  if (!relation) return <>{children}</>;

  // Try to access fields, fallback if not present in type definition yet
  const r = relation;
  const name = r.name;

  const confVal = r.confidence || 0;

  let confColor = 'red';
  if (confVal >= 80) {
    confColor = 'green';
  } else if (confVal >= 50) {
    confColor = 'yellow';
  }

  const formatDate = (ts?: string) => {
    if (!ts) return 'N/A';
    try {
      const d = new Date(parseInt(ts) * 1000);
      return d.toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <Stack gap="xs" p={4}>
      <Group justify="space-between" align="center">
        <Text fw={700} size="sm" style={{ lineHeight: 1 }}>{name || 'Relation'}</Text>
        <Group gap={4}>
          <Text size="xs" c="dimmed">{t('common.confidence')}</Text>
          <RingProgress
            size={36}
            thickness={3}
            roundCaps
            sections={[{ value: confVal, color: confColor }]}
            label={
              <Text c={confColor} fw={700} ta="center" size="xs" style={{ fontSize: 9 }}>
                {confVal}
              </Text>
            }
          />
        </Group>
      </Group>

      <Box>
        {children}
      </Box>

      <Group justify="space-between" mt={4}>
        <Text size="xs" c="dimmed" style={{ fontSize: rem(10) }}>{t('common.created')}: {formatDate(relation.createdAt)}</Text>
        <Text size="xs" c="dimmed" style={{ fontSize: rem(10) }}>{t('common.updated')}: {formatDate(relation.updatedAt)}</Text>
      </Group>
    </Stack>
  );
};
