import React from 'react';
import { Stack, Text, Group, Badge } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { V1Person } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { getLocalizedAttribute } from '../common/localeSupport';

interface Props {
  data?: V1Person;
}

export const PersonCard: React.FC<Props> = ({ data }) => {
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
    <Stack gap="xs">
      <Text size="xl" fw={700}>
        {getLocalizedAttribute(data, 'Name', i18n.language) || data?.name}
      </Text>
      <Text>
        {t('entity.person.Card.role')}:{' '}
        {getLocalizedAttribute(data, 'Role', i18n.language) || data?.role}
      </Text>
      <Text>
        {t('entity.person.Card.nationality')}:{' '}
        {getLocalizedAttribute(data, 'Nationality', i18n.language) || data?.nationality}
      </Text>
      {data?.birthDate && (
        <Text size="sm" c="dimmed">
          {t('entity.person.Card.birthDate')}: {formatDate(data.birthDate)}
        </Text>
      )}
      {data?.tags && data.tags.length > 0 && (
        <Group gap={4}>
          <Text size="sm">{t('entity.person.Card.tags')}:</Text>
          {(getLocalizedAttribute(data, 'Tags', i18n.language) || data.tags).map((tag: string) => (
            <Badge key={tag} size="sm" variant="outline">
              {tag}
            </Badge>
          ))}
        </Group>
      )}
      {data?.aliases && data.aliases.length > 0 && (
        <Group gap={4}>
          <Text size="sm">{t('entity.person.Card.aliases')}:</Text>
          {(getLocalizedAttribute(data, 'Aliases', i18n.language) || data.aliases).map(
            (alias: string) => (
              <Badge key={alias} size="sm" color="gray">
                {alias}
              </Badge>
            ),
          )}
        </Group>
      )}
    </Stack>
  );
};
