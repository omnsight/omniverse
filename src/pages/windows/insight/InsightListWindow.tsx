import React, { useEffect } from 'react';
import { Box, ScrollArea, SimpleGrid, Text } from '@mantine/core';
import { ReadService, CreateService } from 'omni-osint-crud-client';
import { useInsightStore } from './insightData';
import { InsightForm } from '../../../components/forms';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useWindowManager } from '../WindowManager';
import { notifications } from '@mantine/notifications';

export const InsightListWindow: React.FC = () => {
  const { t } = useTranslation();
  const { insights, setInsights, setSelected } = useInsightStore();
  const { setActiveWindowByName } = useWindowManager();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['insights'],
    queryFn: () => ReadService.queryViews(),
  });

  useEffect(() => {
    if (isError) {
      console.error('Error fetching insight data', error);
      notifications.show({
        title: t('common.error'),
        message: t('insight.list.loadError'),
        color: 'red',
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (data && data.views) {
      setInsights(data.views);
    }
  }, [data, setInsights]);

  if (insights.length === 0) {
    return (
      <Box pos="relative" h="100%" w="100%">
        {isLoading ? <Text>{t('loading')}</Text> : <Text>{t('insight.list.empty')}</Text>}
      </Box>
    );
  }

  return (
    <Box pos="relative" h="100%" w="100%">
      <ScrollArea h="100%" w="100%" type="scroll" offsetScrollbars>
        <Box p="lg">
          <SimpleGrid cols={3} spacing="xl">
            {insights.map((insight) => (
              <Box
                key={insight._id}
                onClick={() => {
                  setSelected(insight);
                  setActiveWindowByName('Insight');
                }}
              >
                <InsightForm insight={insight} />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </ScrollArea>
    </Box>
  );
};
