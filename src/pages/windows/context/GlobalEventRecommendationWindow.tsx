import React, { useEffect, useMemo, useState } from 'react';
import { Box, Group, Loader, ScrollArea, Stack, Title } from '@mantine/core';
import { EventCard } from '@omnsight/osint-entity-components/cards';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { queryEvents } from 'omni-osint-query-client';
import { notifications } from '@mantine/notifications';

type TimeRange = 'today' | 'pastWeek' | 'pastMonth';

export const GlobalEventRecommendationWindowContent: React.FC = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>('today');

  const [start, end] = useMemo(() => {
    const now = new Date();
    const startDate = new Date(now);
    const endDate = new Date(now);

    switch (timeRange) {
      case 'today':
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);
        break;
      case 'pastWeek':
        startDate.setUTCDate(now.getUTCDate() - 7);
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);
        break;
      case 'pastMonth':
        startDate.setUTCMonth(now.getUTCMonth() - 1);
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);
        break;
    }
    return [startDate, endDate];
  }, [timeRange]);

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['recommendation-query', timeRange],
    queryFn: async () => {
      const response = await queryEvents({
        query: {
          date_start: Math.floor(start.getTime() / 1000),
          date_end: Math.floor(end.getTime() / 1000),
        },
      });
      console.debug(`Recommendation data for ${timeRange}`, response.data);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (isSuccess && data?.events?.length === 0) {
      if (timeRange === 'today') {
        setTimeRange('pastWeek');
      } else if (timeRange === 'pastWeek') {
        setTimeRange('pastMonth');
      }
    }
  }, [isSuccess, data, timeRange]);

  useEffect(() => {
    if (isError) {
      console.error('Error querying recommendation data', error);
      notifications.show({
        title: t('common.error'),
        message: t('pages.windows.context.GlobalEventRecommendationWindow.queryError', '?'),
        color: 'red',
      });
    }
  }, [isError, error, t]);

  if (isLoading) {
    return (
      <Group justify="center" align="center" style={{ flex: 1 }}>
        <Loader />
      </Group>
    );
  }

  return (
    <ScrollArea h="100%" w="100%" type="scroll" offsetScrollbars>
      <Box p="lg" pt="sm">
        <Stack>
          {data?.events?.map((entity) => (
            <Box key={entity._id}>
              <EventCard event={entity} />
            </Box>
          ))}
        </Stack>
      </Box>
    </ScrollArea>
  );
};

export const GlobalEventRecommendationWindow: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box pos="relative" h="100%" w="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Box p="lg" pb={0}>
        <Title order={3}>{t('pages.windows.context.GlobalEventRecommendationWindow.title')}</Title>
      </Box>
      <GlobalEventRecommendationWindowContent />
    </Box>
  );
};
