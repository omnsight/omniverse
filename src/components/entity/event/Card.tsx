import { useState, useMemo } from 'react';
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
import { useLocalDataState } from '../../../store/localData';
import { getChangedFields } from '../common/utils';

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
  const { addEntities } = useLocalDataState((state) => state.actions);
  const [pendingUpdates, setPendingUpdates] = useState<Partial<V1Event>>({});

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
    if (Object.keys(pendingUpdates).length === 0) return;
    try {
      const res = await api.v1.entityServiceUpdateEntity('event', event.key!, {
        event: pendingUpdates,
      });

      if (res.data.entity) {
        addEntities([res.data.entity]);
        setPendingUpdates({});
      }
    } catch (error) {
      console.error('Failed to update event:', error);
      notifications.show({
        title: t('common.error'),
        message: t('common.updateError'),
        color: 'red',
      });
    }
  };

  const handleLocalUpdate = (updates: Partial<V1Event>) => {
    setPendingUpdates((prev) => {
      const candidate = { ...prev, ...updates };
      return getChangedFields(candidate, event);
    });
  };

  const handleLocationUpdate = (field: string, value: string) => {
    setPendingUpdates((prev) => {
      const currentLocation = prev.location || event.location || {};
      const newLocation = { ...currentLocation, [field]: value };
      const candidate = { ...prev, location: newLocation };
      return getChangedFields(candidate, event);
    });
  };

  return (
    <Stack gap="xs" mb="xl" style={{ width, position: 'relative' }}>
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
      {withTitle && (
        <EditableTitle
          value={pendingUpdates.title || event.title || ''}
          onChange={(val) => handleLocalUpdate({ title: val })}
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
            handleLocalUpdate({
              happenedAt: (date.getTime() / 1000).toString(),
            })
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
        onChange={(val) => handleLocalUpdate({ description: val })}
        canEdit={canEdit}
        placeholder={t('placeholder.description')}
      />

      <EditableTags
        value={pendingUpdates.tags || event.tags || []}
        onChange={(tags) => handleLocalUpdate({ tags })}
        canEdit={canEdit}
        placeholder={t('placeholder.tags')}
      />
    </Stack>
  );
};
