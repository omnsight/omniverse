import React, { useEffect, useMemo } from 'react';
import { Box, Text } from '@mantine/core';
import { useInsightStore } from './insightData';
import { Editor as InsightEditor } from '../../../components/editor/InsightEditor';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ReadService } from 'omni-osint-crud-client';
import { notifications } from '@mantine/notifications';
import { transformEntities } from '../../../components/forms/entityForm/entity';
import { useAuth } from '../../../provider/AuthContext';

export const InsightWindow: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { selected } = useInsightStore();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['view-entities', selected?._id],
    queryFn: () => ReadService.getViewEntities(selected?._id!),
    enabled: !!selected?._id,
  });

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: t('common.error'),
        message: t('insight.single.loadError'),
        color: 'red',
      });
    }
  }, [isError]);

  const entities = useMemo(() => {
    if (!data) return [];
    return transformEntities(data);
  }, [data]);

  if (!selected) {
    return (
      <Box pos="relative" h="100%" w="100%">
        {!isLoading ? <Text>{t('loading')}</Text> : <Text>{t('insight.single.empty')}</Text>}
      </Box>
    );
  }

  return (
    <Box pos="relative" h="100%" w="100%">
      <InsightEditor
        insight={selected}
        entities={entities}
        readonly={user?.id === selected?.owner}
      />
    </Box>
  );
};
