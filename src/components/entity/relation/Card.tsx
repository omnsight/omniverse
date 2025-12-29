import React, { useState } from 'react';
import { Stack, Group, Text, ActionIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import type { V1Relation } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { EditableNumber } from '../common/EditableNumber';
import { useEntityAuth } from '../common/useEntityAuth';
import { useDataApi } from '../../../api/dataApi';
import { useLocalDataActions } from '../../../store/localData';
import { EditableTitle } from '../common/EditableTitle';
import { getChangedFields } from '../common/utils';

interface Props {
  data: V1Relation;
  readonly?: boolean;
}

export const RelationCard: React.FC<Props> = ({ data, readonly = false }) => {
  const { t } = useTranslation();
  const auth = useEntityAuth(data);
  const canEdit = auth.canEdit && !readonly;
  const api = useDataApi();
  const { addRelations } = useLocalDataActions();
  const [pendingUpdates, setPendingUpdates] = useState<Partial<V1Relation>>({});

  const handleLocalUpdate = (updates: Partial<V1Relation>) => {
    setPendingUpdates((prev) => {
      const candidate = { ...prev, ...updates };
      return getChangedFields(candidate, data);
    });
  };

  const saveUpdates = async () => {
    if (Object.keys(pendingUpdates).length === 0) return;
    const [collection, key] = data.id!.split('/');
    try {
      const res = await api.v1.relationshipServiceUpdateRelationship(
        collection,
        key,
        pendingUpdates as V1Relation,
      );

      if (res.data.relationship) {
        addRelations([res.data.relationship]);
        setPendingUpdates({});
      }
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
        value={pendingUpdates.label || data.label || ''}
        onChange={(val) => handleLocalUpdate({ label: val })}
        canEdit={canEdit}
        placeholder={t('entity.relation.name')}
        order={4}
      />

      <Group gap={4}>
        <Text size="sm">{t('placeholder.confidence')}:</Text>
        <EditableNumber
          value={pendingUpdates.confidence ?? data.confidence ?? 0}
          onChange={(val) => handleLocalUpdate({ confidence: Number(val) })}
          canEdit={canEdit}
          placeholder={t('placeholder.confidence')}
        />
      </Group>
    </Stack>
  );
};
