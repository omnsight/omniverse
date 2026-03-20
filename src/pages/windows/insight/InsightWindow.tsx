import React, { useEffect, useMemo } from 'react';
import { Box, Group, Loader, Text, Title } from '@mantine/core';
import { useInsightStore } from './insightData';
import { Editor as InsightEditor } from '../../../components/editor/InsightEditor';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getViewEntities } from 'omni-osint-crud-client';
import { notifications } from '@mantine/notifications';
import { transformEntities } from '../../../components/forms/entityForm/entity';
import { useAuth } from '../../../provider/AuthContext';

const InsightWindowContent: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { selected } = useInsightStore();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['view-entities', selected?._id],
    queryFn: () =>
      getViewEntities({
        path: {
          id: selected?._id!,
        },
      }),
    enabled: !!selected?._id,
  });

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: t('common.error'),
        message: t('insight.single.queryError'),
        color: 'red',
      });
    }
  }, [isError]);

  const entities = useMemo(() => {
    if (!data?.data) return [];
    return transformEntities(data.data);
  }, [data]);

  if (isLoading) {
    return (
      <Group justify="center" align="center" style={{ flex: 1 }}>
        <Loader />
      </Group>
    );
  }

  if (!selected) {
    return (
      <Group justify="center" align="center" style={{ flex: 1 }}>
        <Text>{t('insight.single.empty')}</Text>
      </Group>
    );
  }

  return (
    <InsightEditor insight={selected} entities={entities} readonly={user?.id === selected?.owner} />
  );
};

export const InsightWindow: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box pos="relative" h="100%" w="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Box p="lg" pb={0}>
        <Title order={3}>{t('insight.single.title')}</Title>
      </Box>
      <InsightWindowContent />
    </Box>
  );
};
