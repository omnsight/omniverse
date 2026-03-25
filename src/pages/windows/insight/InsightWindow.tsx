import { truncate } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { notifications } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Anchor,
  Box,
  Breadcrumbs,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { InsightEditor } from '../../../components/editor/InsightEditor';
import { getViewEntities } from 'omni-osint-crud-client';
import { useInsightStore } from './insightData';
import { transformEntities } from '../../../components/entity/entity';
import { useAuth } from '../../../provider/AuthContext';
import { useWindowManager } from '../WindowManager';
import { useCrudClient } from '../../../api/useCrudyClient';

const InsightWindowContent: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { crudClient } = useCrudClient();
  const selected = useInsightStore((state) => state.getSelectedInsight());
  const { setActiveWindowByName } = useWindowManager();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['view-entities', selected?._id],
    queryFn: () =>
      getViewEntities({
        path: {
          id: selected?._id!,
        },
        client: crudClient,
      }),
    enabled: !!selected?._id,
  });

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: t('common.error'),
        message: t('pages.windows.insight.InsightWindow.queryError', '?'),
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
        <Text>{t('pages.windows.insight.InsightWindow.empty')}</Text>
      </Group>
    );
  }

  const breadcrumbs = [
    <Anchor href="#" onClick={() => setActiveWindowByName('InsightList')} key="1">
      {t('pages.windows.insight.InsightWindow.InsightWindowTitle')}
    </Anchor>,
    <Tooltip label={selected.name} withArrow>
      <Text key="2">
        {truncate(selected.name || '', { length: 20 })}
      </Text>
    </Tooltip>,
  ];

  return (
    <Paper h="100%" w="100%" bg="var(--mantine-color-body)" p="md" display="flex">
      <Stack gap="md" h="100%" w="100%">
        {/* Navigation Section */}
        <Stack gap="xs">
          <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
          <Divider />
        </Stack>

        {/* Editor Section */}
        <Box flex={1} style={{ overflow: 'hidden' }}>
          <InsightEditor
            insight={selected}
            entities={entities}
            readonly={user?.id !== selected?.owner}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export const InsightWindow: React.FC = () => {
  return (
    <Box pos="relative" h="100%" w="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <InsightWindowContent />
    </Box>
  );
};
