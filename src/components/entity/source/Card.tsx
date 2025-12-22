import React from 'react';
import { Box, Group, Text, Badge } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { V1Source } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { getLocalizedAttribute } from '../common/localeSupport';

interface Props {
  data: V1Source;
}

export const SourceCard: React.FC<Props> = ({ data }) => {
  const { t, i18n } = useTranslation();

  return (
    <Box>
      <Group>
        <Text size="sm">{t('entity.source.Card.title')}:</Text>
        <Text c="blue" component="a" href={data.url} target="_blank">
          {getLocalizedAttribute(data, 'Name', i18n.language) || data.name || data.url}
        </Text>
      </Group>
      <Text size="sm">
        {t('entity.source.Card.reliability')}: {data.reliability}%
      </Text>
      {data.tags && data.tags.length > 0 && (
        <Group gap={4} mt="xs">
          {(getLocalizedAttribute(data, 'Tags', i18n.language) || data.tags).map((tag: string) => (
            <Badge key={tag} size="sm" variant="outline">
              {tag}
            </Badge>
          ))}
        </Group>
      )}
    </Box>
  );
};
