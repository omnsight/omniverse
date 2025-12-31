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
import { EditableTitle } from '../common/EditableTitle';
import { useEntityUpdatesActions, usePendingUpdates } from '../../../store/entityUpdates';

interface Props {
  data: V1Person;
  readonly?: boolean;
}

export const PersonCard: React.FC<Props> = ({ data, readonly }) => {
  const { t } = useTranslation();
  const auth = useEntityAuth(data);
  const canEdit = auth.canEdit && !readonly;
  const api = useDataApi();

  const entityId = data.id || '';
  const pendingUpdates = usePendingUpdates<V1Person>(entityId);
  const { setPendingUpdate, saveUpdates: saveUpdatesAction } = useEntityUpdatesActions();

  const saveUpdates = async () => {
    if (!entityId) return;
    try {
      await saveUpdatesAction(entityId, data, 'person', api);
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
      {canEdit && (
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
        onChange={(val) => entityId && setPendingUpdate(entityId, { name: val }, data)}
        canEdit={canEdit}
        placeholder={t('entity.person.name')}
        order={4}
      />

      <Group gap={4}>
        <Text>{t('placeholder.role')}:</Text>
        <EditableText
          value={pendingUpdates.role || data.role}
          onChange={(val) => entityId && setPendingUpdate(entityId, { role: val }, data)}
          canEdit={canEdit}
          placeholder={t('placeholder.role')}
        />
      </Group>

      <Group gap={4}>
        <Text>{t('placeholder.nationality')}:</Text>
        <EditableText
          value={pendingUpdates.nationality || data.nationality}
          onChange={(val) => entityId && setPendingUpdate(entityId, { nationality: val }, data)}
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
            entityId &&
            setPendingUpdate(
              entityId,
              {
                birthDate: (new Date(date).getTime() / 1000).toString(),
              },
              data,
            )
          }
          canEdit={canEdit}
          placeholder={t('placeholder.birthDate')}
        />
      </Group>

      <EditableTags
        value={pendingUpdates.tags || data.tags || []}
        onChange={(tags) => entityId && setPendingUpdate(entityId, { tags }, data)}
        canEdit={canEdit}
        placeholder={t('placeholder.tags')}
      />
    </Stack>
  );
};
