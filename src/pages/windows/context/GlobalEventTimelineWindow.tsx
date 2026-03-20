import { useEffect, useState } from 'react';
import { type Node, type Edge } from 'reactflow';
import { EntityGraph } from '../../../components/graph/Graph';
import { Anchor, Box, Breadcrumbs, Group, Loader, Paper } from '@mantine/core';
import { getTimelineLayout } from '../../../components/graph/layout';
import { useQuery } from '@tanstack/react-query';
import { queryEvents } from 'omni-osint-query-client';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';

export const GlobalEventTimelineGraph: React.FC = () => {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');

  const [start, end] = [new Date(), new Date()];
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['recommendation-query', start, end],
    queryFn: async () =>
      await queryEvents({
        body: {
          date_start: Math.floor(start.getTime() / 1000),
          date_end: Math.floor(end.getTime() / 1000),
        },
      }),
    enabled: !!start && !!end,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (isError) {
      console.error('Error querying recommendation data', error);
      notifications.show({
        title: t('common.error'),
        message: t('context.recommendation.queryError'),
        color: 'red',
      });
    }
  }, [isError, error, t]);

  const date = new Date();
  useEffect(() => {
    if (data?.data?.events) {
      const [nodes, edges] = getTimelineLayout(data.data.events, date, viewMode);
      setNodes(nodes);
      setEdges(edges);
    }
  }, [date, viewMode]);

  if (isLoading) {
    return (
      <Group justify="center" align="center" style={{ flex: 1 }}>
        <Loader />
      </Group>
    );
  }

  return (
    <Box pos="relative" h="100%" w="100%">
      <EntityGraph
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        allowOperations={[]}
      />
      <Box
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        <Paper
          withBorder
          px="xs"
          py={4}
          radius="md"
          shadow="xs"
          style={{
            pointerEvents: 'all',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Breadcrumbs separator="/" separatorMargin="xs">
            <Anchor key={0} onClick={() => setViewMode('year')}>
              {date.getFullYear()}
            </Anchor>
            <Anchor key={1} onClick={() => setViewMode('month')}>
              {date.getMonth() + 1}
            </Anchor>
            <Anchor key={2} onClick={() => setViewMode('day')}>
              {date.getDate()}
            </Anchor>
          </Breadcrumbs>
        </Paper>
      </Box>
    </Box>
  );
};
