import { useState } from 'react';
import { Group, Text, Stack, ActionIcon } from '@mantine/core';
import { CheckIcon } from '@heroicons/react/24/outline';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import type { V1Organization } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { EditableText } from '../common/EditableText';
import { EditableDate } from '../common/EditableDate';
import { EditableTags } from '../common/EditableTags';
import { useEntityAuth } from '../common/useEntityAuth';
import { useDataApi } from '../../../api/dataApi';
import { useLocalDataState } from '../../../store/localData';
import { EditableTitle } from '../common/EditableTitle';
import { getChangedFields } from '../common/utils';

interface Props {
  data: V1Organization;
  readonly?: boolean;
}

export const OrganizationCard: React.FC<Props> = ({ data, readonly }) => {
  const { t } = useTranslation();
  const auth = useEntityAuth(data);
  const canEdit = auth.canEdit && !readonly;
  const api = useDataApi();
  const { addEntities } = useLocalDataState((state) => state.actions);
  const [pendingUpdates, setPendingUpdates] = useState<Partial<V1Organization>>({});

  const handleLocalUpdate = (updates: Partial<V1Organization>) => {
    setPendingUpdates((prev) => {
      const candidate = { ...prev, ...updates };
      return getChangedFields(candidate, data);
    });
  };

  const saveUpdates = async () => {
    if (Object.keys(pendingUpdates).length === 0) return;
    try {
      const res = await api.v1.entityServiceUpdateEntity('organization', data.key!, {
        organization: pendingUpdates,
      });

      if (res.data.entity) {
        addEntities([res.data.entity]);
        setPendingUpdates({});
      }
    } catch (error) {
      console.error('Failed to update organization:', error);
      notifications.show({
        title: t('common.error'),
        message: t('common.updateError'),
        color: 'red',
      });
    }
  };

  return (
    <Stack gap="xs" key={data.id} style={{ position: 'relative' }}>
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
      <EditableTitle
        value={pendingUpdates.name || data.name}
        onChange={(val) => handleLocalUpdate({ name: val })}
        canEdit={canEdit}
        placeholder={t('entity.organization.name')}
        order={4}
      />

      <Group gap={4}>
        <Text size="sm" c="dimmed">
          {t('placeholder.type')}:
        </Text>
        <EditableText
          value={pendingUpdates.type || data.type}
          onChange={(val) => handleLocalUpdate({ type: val })}
          canEdit={canEdit}
          placeholder={t('placeholder.type')}
        />
      </Group>

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
