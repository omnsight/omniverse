import { useState } from 'react';
import { Group, Text, Stack, ActionIcon } from '@mantine/core';
import { ArrowTopRightOnSquareIcon, CheckIcon } from '@heroicons/react/24/outline';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import type { V1Source } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { EditableText } from '../common/EditableText';
import { EditableNumber } from '../common/EditableNumber';
import { EditableTags } from '../common/EditableTags';
import { useEntityAuth } from '../common/useEntityAuth';
import { useDataApi } from '../../../api/dataApi';
import { useLocalDataState } from '../../../store/localData';
import { EditableTitle } from '../common/EditableTitle';
import { getChangedFields } from '../common/utils';

interface Props {
  data: V1Source;
  readonly?: boolean;
}

export const SourceCard: React.FC<Props> = ({ data, readonly }) => {
  const { t } = useTranslation();
  const auth = useEntityAuth(data);
  const canEdit = auth.canEdit && !readonly;
  const api = useDataApi();
  const { addEntities } = useLocalDataState((state) => state.actions);
  const [pendingUpdates, setPendingUpdates] = useState<Partial<V1Source>>({});

  const handleLocalUpdate = (updates: Partial<V1Source>) => {
    setPendingUpdates((prev) => {
      const candidate = { ...prev, ...updates };
      return getChangedFields(candidate, data);
    });
  };

  const saveUpdates = async () => {
    if (Object.keys(pendingUpdates).length === 0) return;
    try {
      const res = await api.v1.entityServiceUpdateEntity('source', data.key!, {
        source: pendingUpdates,
      });

      if (res.data.entity) {
        addEntities([res.data.entity]);
        setPendingUpdates({});
      }
    } catch (error) {
      console.error('Failed to update source:', error);
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
          value={pendingUpdates.name || data.name || data.url}
          onChange={(val) => handleLocalUpdate({ name: val })}
          canEdit={canEdit}
          placeholder={t('entity.source.title')}
          order={4}
        />
        {data.url && (
          <ActionIcon component="a" href={data.url} target="_blank" variant="subtle" size="sm">
            <ArrowTopRightOnSquareIcon style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        )}
      </Group>

      <Group gap={4} wrap="nowrap">
        <Text>{t('placeholder.url')}:</Text>
        <EditableText
          value={pendingUpdates.url || data.url}
          onChange={(val) => handleLocalUpdate({ url: val })}
          canEdit={canEdit}
          placeholder={t('placeholder.url')}
        />
      </Group>

      <Group gap={4}>
        <Text>{t('placeholder.reliability')}:</Text>
        <EditableNumber
          value={pendingUpdates.reliability || data.reliability || 0}
          onChange={(val) => handleLocalUpdate({ reliability: Number(val) })}
          canEdit={canEdit}
          placeholder={t('placeholder.reliability')}
        />
      </Group>

      <EditableTags
        value={pendingUpdates.tags || data.tags || []}
        onChange={(val) => handleLocalUpdate({ tags: val })}
        canEdit={canEdit}
        placeholder={t('placeholder.tags')}
      />
    </Stack>
  );
};
