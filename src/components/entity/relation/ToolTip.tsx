import { Stack, Group, Text, Box, rem, RingProgress } from '@mantine/core';
import type { V1Relation } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { useTranslation } from 'react-i18next';
import { getLocalizedAttribute } from '../common/localeSupport';

interface Props {
  relation?: V1Relation;
  children: React.ReactNode;
}

export const RelationTooltip: React.FC<Props> = ({ relation, children }) => {
  const { t, i18n } = useTranslation();
  if (!relation) return <>{children}</>;

  const confVal = relation.confidence || 0;
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
          {getLocalizedAttribute(relation, 'Name', i18n.language) || relation.name || 'Relation'}
        </Text>
        <Group gap={4}>
          <Text size="xs" c="dimmed">
            {t('entity.relation.ToolTip.confidence')}
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
          {t('entity.relation.ToolTip.created')}: {formatDate(relation.createdAt)}
        </Text>
        <Text size="xs" c="dimmed" style={{ fontSize: rem(10) }}>
          {t('entity.relation.ToolTip.updated')}: {formatDate(relation.updatedAt)}
        </Text>
      </Group>
    </Stack>
  );
};
