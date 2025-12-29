import { EntityGraph } from '../components/graph/EntityGraph';
import { Box } from '@mantine/core';
import { useLocalDataActions, useLocalDataState } from '../store/localData';
import { useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useDataApi } from '../api/dataApi';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';

export const SparkGraph: React.FC = () => {
  const { t } = useTranslation();
  const dataApi = useDataApi();
  const events = useLocalDataState((state) => state.events);
  const { addEntities, addRelations } = useLocalDataActions();

  const queries = useQueries({
    queries: Array.from(events.values()).map((e) => ({
      queryKey: ['event-related-entities', e.id],
      queryFn: async () => {
        const res = await dataApi.v1.entityServiceListEntitiesFromEvent({
          startNode: e.id,
          depth: 1,
        });
        return res.data;
      },
      enabled: !!e.id,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    })),
  });

  useEffect(() => {
    queries.forEach((query) => {
      addEntities(query.data?.entities || []);
      addRelations(query.data?.relations || []);
      if (query.error) {
        console.error('Failed to fetch related entities', query.error);
        notifications.show({
          title: t('common.error'),
          message: t('common.loadError'),
          color: 'red',
        });
      }
    });
  }, [
    queries.map((q) => q.dataUpdatedAt).join(','),
    queries.map((q) => q.errorUpdatedAt).join(','),
  ]);

  return (
    <Box style={{ height: '100%', width: '100%' }}>
      <EntityGraph />
    </Box>
  );
};
