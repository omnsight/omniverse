import { Stack, Group, Text, Box, rem, RingProgress } from '@mantine/core';
import type { Relation } from 'omni-osint-crud-client';
import { useTranslation } from 'react-i18next';

interface Props {
  relation?: Relation;
  children: React.ReactNode;
}

export const RelationTooltip: React.FC<Props> = ({ relation, children }) => {
  const { t } = useTranslation();
  if (!relation) return <>{children}</>;

  const confVal = relation.confidence || 0;
  let confColor = 'red';
  if (confVal >= 80) {
    confColor = 'green';
  } else if (confVal >= 50) {
    confColor = 'yellow';
  }

  const formatDate = (ts?: number | null) => {
    if (!ts) return 'N/A';
    try {
      const d = new Date(ts * 1000);
      return d.toLocaleString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <Stack gap="xs" p={4}>
      <Group justify="space-between" align="center">
        <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
          {relation.label || t('placeholder.relation')}
        </Text>
        <Group gap={4}>
          <Text size="xs" c="dimmed">
            {t('placeholder.confidence')}
          </Text>
          <RingProgress
            size={36}
            thickness={3}
            roundCaps
            sections={[{ value: relation.confidence || 0, color: confColor }]}
            label={
              <Text c={confColor} fw={700} ta="center" size="xs" style={{ fontSize: 9 }}>
                {relation.confidence || 0}
              </Text>
            }
          />
        </Group>
      </Group>

      <Box>{children}</Box>

      <Group justify="space-between" mt={4}>
        <Text size="xs" c="dimmed" style={{ fontSize: rem(10) }}>
          {t('placeholder.createdDate')}: {formatDate(relation.created_at)}
        </Text>
        <Text size="xs" c="dimmed" style={{ fontSize: rem(10) }}>
          {t('placeholder.updatedDate')}: {formatDate(relation.updated_at)}
        </Text>
      </Group>
    </Stack>
  );
};
