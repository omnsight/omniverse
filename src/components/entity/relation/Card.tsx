import React from 'react';
import { Stack, Group, Text, ActionIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import type { V1Relation } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { EditableNumber } from '../common/EditableNumber';
import { useEntityAuth } from '../common/useEntityAuth';
import { useDataApi } from '../../../api/dataApi';
import { EditableTitle } from '../common/EditableTitle';
import { EditableText } from '../common/EditableText';
import { useEntityUpdatesActions, usePendingUpdates } from '../../../store/entityUpdates';

interface Props {
  data: V1Relation;
  readonly?: boolean;
}

export const RelationCard: React.FC<Props> = ({ data, readonly = false }) => {
  const { t } = useTranslation();
  const auth = useEntityAuth(data);
  const canEdit = auth.canEdit && !readonly;
  const api = useDataApi();

  const entityId = data.id || '';
  const pendingUpdates = usePendingUpdates<V1Relation>(entityId);
  const { setPendingUpdate, saveUpdates: saveUpdatesAction } = useEntityUpdatesActions();

  const saveUpdates = async () => {
    if (!entityId || Object.keys(pendingUpdates).length === 0) return;

    if (!pendingUpdates.name) {
      notifications.show({
        title: t('common.error'),
        message: t('entity.relation.nameRequired'),
        color: 'red',
      });
      return;
    }

    try {
      await saveUpdatesAction(entityId, data, 'relation', api);
    } catch (error) {
      console.error('Failed to update relation:', error);
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
        value={pendingUpdates.label || data.label || ''}
        onChange={(val) => entityId && setPendingUpdate(entityId, { label: val }, data)}
        canEdit={canEdit}
        placeholder={t('entity.relation.name')}
        order={4}
      />

      <Group gap={4}>
        <Text size="sm">{t('entity.relation.name')}:</Text>
        <EditableText
          value={pendingUpdates.name || data.name}
          onChange={(val) => entityId && setPendingUpdate(entityId, { name: val }, data)}
          canEdit={canEdit}
          placeholder={t('entity.relation.name')}
        />
      </Group>

      <Group gap={4}>
        <Text size="sm">{t('placeholder.confidence')}:</Text>
        <EditableNumber
          value={pendingUpdates.confidence ?? data.confidence ?? 0}
          onChange={(val) =>
            entityId && setPendingUpdate(entityId, { confidence: Number(val) }, data)
          }
          canEdit={canEdit}
          placeholder={t('placeholder.confidence')}
        />
      </Group>
    </Stack>
  );
};
