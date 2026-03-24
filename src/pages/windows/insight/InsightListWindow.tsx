import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { notifications } from '@mantine/notifications';
import { ActionIcon, Box, Button, Group, Loader, ScrollArea, Stack, Title } from '@mantine/core';
import { InsightForm } from '../../../components/forms';
import { useCrudClient } from '../../../api/useCrudyClient';
import type { OsintView } from 'omni-osint-crud-client/types';
import { createView, queryViews, updateView } from 'omni-osint-crud-client/sdk';
import { useInsightStore } from './insightData';
import { useWindowManager } from '../WindowManager';
import { useAuth } from '../../../provider/AuthContext';

const InsightListWindowContent: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { crudClient, authed } = useCrudClient();
  const { insights, setInsights, setSelected } = useInsightStore();
  const { setActiveWindowByName } = useWindowManager();
  const [creating, setCreating] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const { data, error } = await queryViews({ client: crudClient });
      if (error) {
        console.error('Error fetching insight data', error);
        throw error;
      }
      console.debug('Fetched insights', data);
      return data;
    },
    staleTime: 1 * 60 * 1000,
  });

  useEffect(() => {
    if (error) {
      console.error('Error fetching insight data', error);
      notifications.show({
        title: t('common.error'),
        message: t('pages.windows.insight.InsightListWindow.queryError'),
        color: 'red',
      });
    }
  }, [error]);

  useEffect(() => {
    if (data?.views) {
      setInsights(data.views);
    }
  }, [data, setInsights]);

  const submitNewInsight = async (insight: OsintView) => {
    if (!insight) return;
    const { data, error, status } = await createView({
      body: insight,
      client: crudClient,
    });

    if (error) {
      console.error(`Error [${status}] creating insight`, error);
      notifications.show({
        title: t('common.error'),
        message: t('pages.windows.insight.InsightListWindow.createError'),
        color: 'red',
      });
    } else {
      setInsights([...insights, data]);
      setCreating(false);
      console.log('Created insight', data);
    }
  };

  const updateInsight = async (id: string, patch: Partial<OsintView>) => {
    console.debug('Updating insight', id, patch);
    const { data, error, status } = await updateView({
      body: patch,
      path: {
        id,
      },
      client: crudClient,
    });

    if (error) {
      console.error(`Error [${status}] updating insight`, error);
      notifications.show({
        title: t('common.error'),
        message: t('pages.windows.insight.InsightListWindow.error'),
        color: 'red',
      });
    } else {
      setInsights(insights.map((insight) => (insight._id === id ? data : insight)));
      console.log('Updated insight', data);
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
              useInput={false}
              onUpdate={
                user?.id === insight.owner
                  ? (data) => insight._id && updateInsight(insight._id, data)
                  : undefined
              }
              onClose={() => {}}
              exitButton={
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (insight._id) {
                      setSelected(insight._id);
                      setActiveWindowByName('Insight');
                    }
                  }}
                >
                  <ArrowRightIcon style={{ width: 18, height: 18 }} />
                </ActionIcon>
              }
            />
          ))}
          {authed &&
            (creating ? (
              <InsightForm
                insight={{
                  analysis: [
                    {
                      type: 'doc',
                      content: [
                        {
                          type: 'paragraph',
                          content: [{ type: 'text', text: '' }],
                        },
                      ],
                    },
                  ],
                }}
                useInput={true}
                onSubmit={submitNewInsight}
                onClose={() => setCreating(false)}
              />
            ) : (
              <Button
                fullWidth
                data-testid="add-insight-button"
                onClick={() => setCreating(true)}
              >
                <PlusIcon style={{ width: 20, height: 20 }} />
              </Button>
            ))}
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
        <Title order={3}>{t('pages.windows.insight.InsightListWindow.title')}</Title>
      </Box>
      <InsightListWindowContent />
    </Box>
  );
};
