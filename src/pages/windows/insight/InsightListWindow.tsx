import React, { useEffect, useState } from 'react';
import { Box, Button, Group, Loader, Paper, ScrollArea, Stack, Title } from '@mantine/core';
import {
  type OsintView,
  type OsintViewMainData,
  ReadService,
  CreateService,
} from 'omni-osint-crud-client';
import { PlusIcon } from '@heroicons/react/24/solid';
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
  const [insightToCreate, setInsightToCreate] = useState<OsintView | undefined>(undefined);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['insights'],
    queryFn: () => ReadService.queryViews(),
  });

  useEffect(() => {
    if (isError) {
      console.error('Error fetching insight data', error);
      notifications.show({
        title: t('common.error'),
        message: t('insight.list.queryError'),
        color: 'red',
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (data && data.views) {
      setInsights(data.views);
    }
  }, [data, setInsights]);

  const updateInsight = (data: OsintViewMainData) => {
    if (!insightToCreate) return;
    setInsightToCreate({
      ...insightToCreate,
      ...data,
    });
  };

  const createInsight = async () => {
    if (!insightToCreate) return;
    try {
      const insight = await CreateService.createView(insightToCreate);
      setInsights([...insights, insight]);
      setInsightToCreate(undefined);
      console.log('Created insight', insight);
    } catch (error) {
      console.error('Error creating insight', error);
      notifications.show({
        title: t('common.error'),
        message: t('insight.create.error'),
        color: 'red',
      });
    }
  };

  if (isLoading) {
    return (
      <Box pos="relative" h="100%" w="100%" style={{ display: 'flex', flexDirection: 'column' }}>
        <Box p="lg" pb={0}>
          <Title order={3}>{t('insight.list.title')}</Title>
        </Box>
        <Group justify="center" align="center" style={{ flex: 1 }}>
          <Loader />
        </Group>
      </Box>
    );
  }

  return (
    <Box pos="relative" h="100%" w="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Box p="lg" pb={0}>
        <Title order={3}>{t('insight.list.title')}</Title>
      </Box>
      <Box style={{ flex: 1, minHeight: 0 }}>
        <ScrollArea h="100%" w="100%" type="scroll" offsetScrollbars>
          <Box p="lg" pt="sm">
            <Stack>
              {insights.map((insight) => (
                <InsightForm
                  key={insight._id}
                  insight={insight}
                  useLabel={false}
                  useInput={false}
                  onClick={() => {
                    setSelected(insight);
                    setActiveWindowByName('Insight');
                  }}
                />
              ))}
              {insightToCreate ? (
                <Paper withBorder p="md">
                  <InsightForm
                    useLabel={true}
                    insight={insightToCreate}
                    useInput={true}
                    onUpdate={updateInsight}
                  />
                  <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={() => setInsightToCreate(undefined)}>
                      {t('common.cancel')}
                    </Button>
                    <Button onClick={createInsight}>{t('common.create')}</Button>
                  </Group>
                </Paper>
              ) : (
                <Button
                  fullWidth
                  leftSection={<PlusIcon style={{ width: 20, height: 20 }} />}
                  onClick={() => setInsightToCreate({} as OsintView)}
                >
                  {t('insight.list.create.new')}
                </Button>
              )}
            </Stack>
          </Box>
        </ScrollArea>
      </Box>
    </Box>
  );
};
