import React from 'react';
import { Stack, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { V1Relation } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { getLocalizedAttribute } from '../common/localeSupport';

interface Props {
  data: V1Relation;
}

export const RelationCard: React.FC<Props> = ({ data }) => {
  const { t, i18n } = useTranslation();

  return (
    <Stack gap="xs">
      <Group>
        <Text size="sm">{t('entity.relation.Card.type')}:</Text>
        <Text>
          {getLocalizedAttribute(data, 'Name', i18n.language) ||
            data.name ||
            t('entity.relation.Card.unknown')}
        </Text>
      </Group>
      <Group>
        <Text size="sm">{t('entity.relation.Card.confidence')}:</Text>
        <Text>{data.confidence || 0}%</Text>
      </Group>
    </Stack>
  );
};
