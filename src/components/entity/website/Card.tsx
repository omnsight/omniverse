import React, { useState } from 'react';
import { Stack, Group, Text, ActionIcon } from '@mantine/core';
import { CheckIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import type { V1Website } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { EditableText } from '../common/EditableText';
import { EditableDate } from '../common/EditableDate';
import { EditableTextarea } from '../common/EditableTextarea';
import { EditableTags } from '../common/EditableTags';
import { useEntityAuth } from '../common/useEntityAuth';
import { useDataApi } from '../../../api/dataApi';
import { useLocalDataState } from '../../../store/localData';
import { EditableTitle } from '../common/EditableTitle';
import { getChangedFields } from '../common/utils';

interface Props {
  data: V1Website;
  readonly?: boolean;
}

export const WebsiteCard: React.FC<Props> = ({ data, readonly }) => {
  const { t } = useTranslation();
  const auth = useEntityAuth(data);
  const canEdit = auth.canEdit && !readonly;
  const api = useDataApi();
  const { addEntities } = useLocalDataState((state) => state.actions);
  const [pendingUpdates, setPendingUpdates] = useState<Partial<V1Website>>({});

  const handleLocalUpdate = (updates: Partial<V1Website>) => {
    setPendingUpdates((prev) => {
      const candidate = { ...prev, ...updates };
      return getChangedFields(candidate, data);
    });
  };

  const saveUpdates = async () => {
    if (Object.keys(pendingUpdates).length === 0) return;
    try {
      const res = await api.v1.entityServiceUpdateEntity('website', data.key!, {
        website: pendingUpdates,
      });

      if (res.data.entity) {
        addEntities([res.data.entity]);
        setPendingUpdates({});
      }
    } catch (error) {
      console.error('Failed to update website:', error);
      notifications.show({
        title: t('common.error'),
        message: t('common.updateError'),
        color: 'red',
      });
    }
  };

  return (
    <Stack gap="xs" style={{ position: 'relative' }}>
      {!readonly && (
        <ActionIcon
          onClick={saveUpdates}
          size="md"
          pos="absolute"
          top={0}
          right={0}
          style={{ zIndex: 10 }}
          color="green"
          disabled={Object.keys(pendingUpdates).length === 0}
          variant={Object.keys(pendingUpdates).length > 0 ? 'filled' : 'light'}
          radius="xl"
        >
          <CheckIcon
            style={{
              width: '70%',
              height: '70%',
              color: Object.keys(pendingUpdates).length > 0 ? 'white' : undefined,
            }}
          />
        </ActionIcon>
      )}
      <Group gap="xs">
        <EditableTitle
          value={pendingUpdates.title || data.title}
          onChange={(val) => handleLocalUpdate({ title: val })}
          canEdit={canEdit}
          placeholder={t('entity.website.name')}
          order={4}
        />
        {data.url && (
          <ActionIcon component="a" href={data.url} target="_blank" variant="subtle" size="sm">
            <ArrowTopRightOnSquareIcon style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        )}
      </Group>

      <Group gap={4}>
        <Text>{t('placeholder.url')}:</Text>
        <EditableText
          value={pendingUpdates.url ?? data.url}
          onChange={(val) => handleLocalUpdate({ url: val })}
          canEdit={canEdit}
          placeholder={t('placeholder.url')}
        />
      </Group>

      <EditableTextarea
        value={pendingUpdates.description || data.description}
        onChange={(val) => handleLocalUpdate({ description: val })}
        canEdit={canEdit}
        placeholder={t('placeholder.description')}
      />

      <Group gap={4}>
        <Text size="sm" c="dimmed">
          {t('placeholder.foundedDate')}:
        </Text>
        <EditableDate
          value={parseInt(pendingUpdates.foundedAt || data.foundedAt || '0') * 1000}
          onChange={(date) =>
            handleLocalUpdate({
              foundedAt: (new Date(date).getTime() / 1000).toString(),
            })
          }
          canEdit={canEdit}
          placeholder={t('placeholder.foundedDate')}
        />
      </Group>

      <Group gap={4}>
        <Text size="sm" c="dimmed">
          {t('placeholder.discoveredDate')}:
        </Text>
        <EditableDate
          value={parseInt(pendingUpdates.discoveredAt || data.discoveredAt || '0') * 1000}
          onChange={(date) =>
            handleLocalUpdate({
              discoveredAt: (new Date(date).getTime() / 1000).toString(),
            })
          }
          canEdit={canEdit}
          placeholder={t('placeholder.discoveredDate')}
        />
      </Group>

      <EditableTags
        value={pendingUpdates.tags || data.tags || []}
        onChange={(tags) => handleLocalUpdate({ tags })}
        canEdit={canEdit}
        placeholder={t('placeholder.tags')}
      />
    </Stack>
  );
};
