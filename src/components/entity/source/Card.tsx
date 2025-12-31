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
import { EditableTitle } from '../common/EditableTitle';
import { useEntityUpdatesActions, usePendingUpdates } from '../../../store/entityUpdates';

interface Props {
  data: V1Source;
  readonly?: boolean;
}

export const SourceCard: React.FC<Props> = ({ data, readonly }) => {
  const { t } = useTranslation();
  const auth = useEntityAuth(data);
  const canEdit = auth.canEdit && !readonly;
  const api = useDataApi();

  const entityId = data.id || '';
  const pendingUpdates = usePendingUpdates<V1Source>(entityId);
  const { setPendingUpdate, saveUpdates: saveUpdatesAction } = useEntityUpdatesActions();

  const saveUpdates = async () => {
    if (!entityId) return;
    try {
      await saveUpdatesAction(entityId, data, 'source', api);
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
      <Group gap="xs">
        <EditableTitle
          value={pendingUpdates.name || data.name || data.url}
          onChange={(val) => entityId && setPendingUpdate(entityId, { name: val }, data)}
          canEdit={canEdit}
          placeholder={t('entity.source.title')}
          order={4}
          style={{ flex: 'initial' }}
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
          onChange={(val) => entityId && setPendingUpdate(entityId, { url: val }, data)}
          canEdit={canEdit}
          placeholder={t('placeholder.url')}
        />
      </Group>

      <Group gap={4}>
        <Text>{t('placeholder.reliability')}:</Text>
        <EditableNumber
          value={pendingUpdates.reliability || data.reliability || 0}
          onChange={(val) =>
            entityId && setPendingUpdate(entityId, { reliability: Number(val) }, data)
          }
          canEdit={canEdit}
          placeholder={t('placeholder.reliability')}
        />
      </Group>

      <EditableTags
        value={pendingUpdates.tags || data.tags || []}
        onChange={(val) => entityId && setPendingUpdate(entityId, { tags: val }, data)}
        canEdit={canEdit}
        placeholder={t('placeholder.tags')}
      />
    </Stack>
  );
};
