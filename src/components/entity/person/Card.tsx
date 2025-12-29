import { useState } from 'react';
import { Stack, Text, Group, ActionIcon } from '@mantine/core';
import { CheckIcon } from '@heroicons/react/24/outline';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import type { V1Person } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { EditableText } from '../common/EditableText';
import { EditableDate } from '../common/EditableDate';
import { EditableTags } from '../common/EditableTags';
import { useEntityAuth } from '../common/useEntityAuth';
import { useDataApi } from '../../../api/dataApi';
import { useLocalDataState } from '../../../store/localData';
import { EditableTitle } from '../common/EditableTitle';
import { getChangedFields } from '../common/utils';

interface Props {
  data: V1Person;
  readonly?: boolean;
}

export const PersonCard: React.FC<Props> = ({ data, readonly }) => {
  const { t } = useTranslation();
  const auth = useEntityAuth(data);
  const canEdit = auth.canEdit && !readonly;
  const api = useDataApi();
  const { addEntities } = useLocalDataState((state) => state.actions);
  const [pendingUpdates, setPendingUpdates] = useState<Partial<V1Person>>({});

  const handleLocalUpdate = (updates: Partial<V1Person>) => {
    setPendingUpdates((prev) => {
      const candidate = { ...prev, ...updates };
      return getChangedFields(candidate, data);
    });
  };

  const saveUpdates = async () => {
    if (Object.keys(pendingUpdates).length === 0) return;
    try {
      const res = await api.v1.entityServiceUpdateEntity('person', data.key!, {
        person: pendingUpdates,
      });

      if (res.data.entity) {
        addEntities([res.data.entity]);
        setPendingUpdates({});
      }
    } catch (error) {
      console.error('Failed to update person:', error);
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
      <EditableTitle
        value={pendingUpdates.name || data.name}
        onChange={(val) => handleLocalUpdate({ name: val })}
        canEdit={canEdit}
        placeholder={t('entity.person.name')}
        order={4}
      />

      <Group gap={4}>
        <Text>{t('placeholder.role')}:</Text>
        <EditableText
          value={pendingUpdates.role || data.role}
          onChange={(val) => handleLocalUpdate({ role: val })}
          canEdit={canEdit}
          placeholder={t('placeholder.role')}
        />
      </Group>

      <Group gap={4}>
        <Text>{t('placeholder.nationality')}:</Text>
        <EditableText
          value={pendingUpdates.nationality || data.nationality}
          onChange={(val) => handleLocalUpdate({ nationality: val })}
          canEdit={canEdit}
          placeholder={t('placeholder.nationality')}
        />
      </Group>

      <Group gap={4}>
        <Text size="sm" c="dimmed">
          {t('placeholder.birthDate')}:
        </Text>
        <EditableDate
          value={parseInt(pendingUpdates.birthDate || data.birthDate || '0') * 1000}
          onChange={(date) =>
            handleLocalUpdate({
              birthDate: (new Date(date).getTime() / 1000).toString(),
            })
          }
          canEdit={canEdit}
          placeholder={t('placeholder.birthDate')}
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
