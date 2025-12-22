import { Group, Text, Stack, Badge } from '@mantine/core';
import type { V1Organization } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { useTranslation } from 'react-i18next';
import { getLocalizedAttribute } from '../common/localeSupport';

interface Props {
  data?: V1Organization;
}

export const OrganizationCard: React.FC<Props> = ({ data }) => {
  const { t, i18n } = useTranslation();
  const formatDate = (ts?: string) => {
    if (!ts) return null;
    const d = new Date(parseInt(ts) * 1000);
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <Stack gap="xs" key={data?.id}>
      <Text size="lg" fw={700}>
        {getLocalizedAttribute(data, 'Name', i18n.language) || data?.name}
      </Text>
      <Text size="sm" c="dimmed">
        {t('entity.organization.Card.type')}:{' '}
        {getLocalizedAttribute(data, 'Type', i18n.language) || data?.type}
      </Text>
      {data?.foundedAt && (
        <Text size="sm" c="dimmed">
          {t('entity.organization.Card.foundedDate')}: {formatDate(data.foundedAt)}
        </Text>
      )}
      {data?.tags && data.tags.length > 0 && (
        <Group gap={4}>
          {(getLocalizedAttribute(data, 'Tags', i18n.language) || data.tags).map((tag: string) => (
            <Badge key={tag} size="sm" variant="outline">
              {tag}
            </Badge>
          ))}
        </Group>
      )}
    </Stack>
  );
};
