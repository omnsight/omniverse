import React, { useEffect } from 'react';
import { Box, Group, Loader, ScrollArea, SimpleGrid } from '@mantine/core';
import { EventForm } from '../../../components/forms';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { queryEvents } from 'omni-osint-query-client';
import { notifications } from '@mantine/notifications';

export const GlobalEventRecommendationWindow: React.FC = () => {
  const { t } = useTranslation();

  const [start, end] = [new Date(), new Date()];
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['recommendation-query', start, end],
    queryFn: async () => {
      const response = await queryEvents({
        query: {
          date_start: Math.floor(start.getTime() / 1000),
          date_end: Math.floor(end.getTime() / 1000),
        },
      });
      console.debug('Recommendation data', response.data);
      return response.data;
    },
    enabled: !!start && !!end,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

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
    <Box pos="relative" h="100%" w="100%">
      <ScrollArea h="100%" w="100%" type="scroll" offsetScrollbars>
        <Box p="lg">
          <SimpleGrid cols={3} spacing="xl">
            {data?.events?.map((entity) => (
              <Box key={entity._id}>
                <EventForm event={entity} onClose={() => {}} />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </ScrollArea>
    </Box>
  );
};
