import { useMemo } from 'react';
import { CalendarDaysIcon, MapPinIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Group, Stack, rem, ActionIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { V1Event } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { useTranslation } from 'react-i18next';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import zhLocale from 'i18n-iso-countries/langs/zh.json';
import { EditableText } from '../common/EditableText';
import { EditableSelect } from '../common/EditableSelect';
import { EditableTitle } from '../common/EditableTitle';
import { EditableDate } from '../common/EditableDate';
import { EditableTextarea } from '../common/EditableTextarea';
import { EditableTags } from '../common/EditableTags';
import { useEntityAuth } from '../common/useEntityAuth';
import { useDataApi } from '../../../api/dataApi';
import { useEntityUpdatesActions, usePendingUpdates } from '../../../store/entityUpdates';

// Register locales
countries.registerLocale(enLocale);
countries.registerLocale(zhLocale);

interface Props {
  event: V1Event;
  width?: number | string;
  withTitle?: boolean;
  readonly?: boolean;
}

export const EventCard: React.FC<Props> = ({ event, width, withTitle, readonly }) => {
  const { t, i18n } = useTranslation();
  const auth = useEntityAuth(event);
  const canEdit = auth.canEdit && !readonly;
  const api = useDataApi();

  const entityId = event.id || '';
  const pendingUpdates = usePendingUpdates<V1Event>(entityId);
  const { setPendingUpdate, saveUpdates: saveUpdatesAction } = useEntityUpdatesActions();

  // Generate country list based on current language
  const countryOptions = useMemo(() => {
    // Map i18next language code to i18n-iso-countries language code
    // 'zh' in i18next -> 'zh' in i18n-iso-countries
    const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
    const countryObj = countries.getNames(lang, { select: 'official' });

    return Object.entries(countryObj)
      .map(([code, name]) => ({
        value: code,
        label: name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [i18n.language]);

  const saveUpdates = async () => {
    if (!entityId) return;
    try {
      await saveUpdatesAction(entityId, event, 'event', api);
    } catch (error) {
      console.error('Failed to update event:', error);
      notifications.show({
        title: t('common.error'),
        message: t('common.updateError'),
        color: 'red',
      });
    }
  };

  const handleLocationUpdate = (field: string, value: string) => {
    if (!entityId) return;
    const currentLocation = pendingUpdates.location || event.location || {};
    const newLocation = { ...currentLocation, [field]: value };
    setPendingUpdate(entityId, { location: newLocation }, event);
  };

  return (
    <Stack gap="xs" mb="xl" style={{ width, position: 'relative' }}>
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
      {withTitle && (
        <EditableTitle
          value={pendingUpdates.title || event.title || ''}
          onChange={(val) => entityId && setPendingUpdate(entityId, { title: val }, event)}
          canEdit={canEdit}
          placeholder={t('entity.event.title')}
          order={4}
        />
      )}

      <Group gap="xs" c="dimmed">
        <CalendarDaysIcon style={{ width: rem(18), height: rem(18) }} />
        <EditableDate
          value={parseInt(pendingUpdates.happenedAt || event.happenedAt || '0') * 1000}
          onChange={(date) =>
            entityId &&
            setPendingUpdate(
              entityId,
              {
                happenedAt: (date.getTime() / 1000).toString(),
              },
              event,
            )
          }
          canEdit={canEdit}
          placeholder={t('placeholder.date')}
        />
      </Group>

      <Group gap="xs" c="dimmed" align="flex-start" wrap="nowrap">
        <MapPinIcon style={{ width: rem(18), height: rem(18), flexShrink: 0, marginTop: rem(2) }} />
        <Stack gap={0} style={{ flex: 1 }}>
          <EditableText
            value={(pendingUpdates.location || event.location || {}).address}
            onChange={(val) => handleLocationUpdate('address', val)}
            canEdit={canEdit}
            placeholder={t('placeholder.address')}
          />
          <EditableText
            value={(pendingUpdates.location || event.location || {}).locality}
            onChange={(val) => handleLocationUpdate('locality', val)}
            canEdit={canEdit}
            placeholder={t('placeholder.locality')}
          />
          <EditableText
            value={(pendingUpdates.location || event.location || {}).administrativeArea}
            onChange={(val) => handleLocationUpdate('administrativeArea', val)}
            canEdit={canEdit}
            placeholder={t('placeholder.administrativeArea')}
          />
          <EditableSelect
            value={(pendingUpdates.location || event.location || {}).countryCode}
            onChange={(val) => handleLocationUpdate('countryCode', val)}
            canEdit={canEdit}
            placeholder={t('placeholder.country')}
            data={countryOptions}
            searchable
            clearable
          />
        </Stack>
      </Group>

      <EditableTextarea
        value={pendingUpdates.description || event.description || ''}
        onChange={(val) => entityId && setPendingUpdate(entityId, { description: val }, event)}
        canEdit={canEdit}
        placeholder={t('placeholder.description')}
      />

      <EditableTags
        value={pendingUpdates.tags || event.tags || []}
        onChange={(tags) => entityId && setPendingUpdate(entityId, { tags }, event)}
        canEdit={canEdit}
        placeholder={t('placeholder.tags')}
      />
    </Stack>
  );
};
