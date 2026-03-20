import React, { useEffect, useState } from 'react';
import { Box, Button, Group, Loader, ScrollArea, Stack, Title } from '@mantine/core';
import {
  type OsintView,
  type OsintViewMainData,
  createView,
  queryViews,
} from 'omni-osint-crud-client';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useInsightStore } from './insightData';
import { InsightForm } from '../../../components/forms';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useWindowManager } from '../WindowManager';
import { notifications } from '@mantine/notifications';
import { InputWindow } from '../../../components/modals/InputWindow';

const InsightListWindowContent: React.FC = () => {
  const { t } = useTranslation();
  const { insights, setInsights, setSelected } = useInsightStore();
  const { setActiveWindowByName } = useWindowManager();
  const [insightToCreate, setInsightToCreate] = useState<OsintView | undefined>(undefined);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['insights'],
    queryFn: () => queryViews(),
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
    if (data?.data?.views) {
      setInsights(data.data.views);
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
    const { data, error, status } = await createView({
      body: insightToCreate,
    });

    if (error) {
      console.error(`Error [${status}] creating insight`, error);
      notifications.show({
        title: t('common.error'),
        message: t('insight.create.error'),
        color: 'red',
      });
    } else {
      setInsights([...insights, data]);
      setInsightToCreate(undefined);
      console.log('Created insight', data);
    }
  };

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
            <InputWindow
              title={t('insight.create.title')}
              cancel={t('common.cancel')}
              submit={t('common.create')}
              onClose={() => setInsightToCreate(undefined)}
              onSubmit={createInsight}
            >
              <InsightForm
                useLabel={true}
                insight={insightToCreate}
                useInput={true}
                onUpdate={updateInsight}
              />
            </InputWindow>
          ) : (
            <Button
              fullWidth
              leftSection={<PlusIcon style={{ width: 20, height: 20 }} />}
              onClick={() => setInsightToCreate({ analysis: [] })}
            >
              {t('insight.list.create.new')}
            </Button>
          )}
        </Stack>
      </Box>
    </ScrollArea>
  );
};

export const InsightListWindow: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box pos="relative" h="100%" w="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Box p="lg" pb={0}>
        <Title order={3}>{t('insight.list.title')}</Title>
      </Box>
      <InsightListWindowContent />
    </Box>
  );
};
