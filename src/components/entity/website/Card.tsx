import React from 'react';
import { Stack, Group, Text, ActionIcon, Badge } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import type { V1Website } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { getLocalizedAttribute } from '../common/localeSupport';

interface Props {
  data: V1Website;
}

export const WebsiteCard: React.FC<Props> = ({ data }) => {
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
      <Group>
        <Text size="lg" fw={700}>
          {getLocalizedAttribute(data, 'Title', i18n.language) || data.title}
        </Text>
        {data.url && (
          <ActionIcon component="a" href={data.url} target="_blank" variant="subtle" size="sm">
            <ArrowTopRightOnSquareIcon style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        )}
      </Group>
      <Text size="sm">
        {getLocalizedAttribute(data, 'Description', i18n.language) || data.description}
      </Text>
      <Text size="sm" c="dimmed">
        {t('entity.website.Card.foundedDate')}: {formatDate(data.foundedAt)}
      </Text>
      {data.tags && data.tags.length > 0 && (
        <Group gap={4}>
          <Text size="sm">{t('entity.website.Card.tags')}:</Text>
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
