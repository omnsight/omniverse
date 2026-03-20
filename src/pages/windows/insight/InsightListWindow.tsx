import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { notifications } from '@mantine/notifications';
import { ActionIcon, Box, Button, Group, Loader, ScrollArea, Stack, Title } from '@mantine/core';
import { InsightForm } from '../../../components/forms';
import { InputWindow } from '../../../components/modals/InputWindow';
import { useCrudClient } from '../../../api/useCrudyClient';
import type { OsintView, OsintViewMainData } from 'omni-osint-crud-client/types';
import { createView, queryViews, updateView } from 'omni-osint-crud-client/sdk';
import { useInsightStore } from './insightData';
import { useWindowManager } from '../WindowManager';
import { useAuth } from '../../../provider/AuthContext';

interface CreationModalProps {
  insight: OsintView | undefined;
  setInsight: (insight: OsintView | undefined) => void;
}

const CreationModal: React.FC<CreationModalProps> = ({ insight, setInsight }) => {
  const { t } = useTranslation();
  const { crudClient } = useCrudClient();
  const { insights, setInsights } = useInsightStore();

  const updateInsight = (data: OsintViewMainData) => {
    if (!insight) return;
    setInsight({
      ...insight,
      ...data,
    });
  };

  const createInsight = async () => {
    if (!insight) return;
    const { data, error, status } = await createView({
      body: insight,
      client: crudClient,
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
      setInsight(undefined);
      console.log('Created insight', data);
    }
  };

  if (insight) {
    return (
      <InputWindow
        title={t('insight.create.title')}
        cancel={t('common.cancel')}
        submit={t('common.create')}
        onClose={() => setInsight(undefined)}
        onSubmit={createInsight}
      >
        <InsightForm insight={insight} useLabel={true} useInput={true} onUpdate={updateInsight} />
      </InputWindow>
    );
  } else {
    return (
      <Button
        fullWidth
        onClick={() =>
          setInsight({
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
          })
        }
      >
        <PlusIcon style={{ width: 20, height: 20 }} />
      </Button>
    );
  }
};

const InsightListWindowContent: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { crudClient, authed } = useCrudClient();
  const { insights, setInsights, setSelected } = useInsightStore();
  const { setActiveWindowByName } = useWindowManager();
  const [insightToCreate, setInsightToCreate] = useState<OsintView | undefined>(undefined);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const response = await queryViews({ client: crudClient });
      console.debug('Fetched insights', response.data);
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
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
    if (data?.views) {
      setInsights(data.views);
    }
  }, [data, setInsights]);

  const updateInsight = async (id: string, patch: OsintViewMainData) => {
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
        message: t('insight.update.error'),
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
              useLabel={false}
              useInput={false}
              onUpdate={
                user?.id === insight.owner
                  ? (data) => insight._id && updateInsight(insight._id, data)
                  : undefined
              }
            >
              <Box style={{ position: 'absolute', top: 10, right: 10 }}>
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
              </Box>
            </InsightForm>
          ))}
          {authed && <CreationModal insight={insightToCreate} setInsight={setInsightToCreate} />}
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
