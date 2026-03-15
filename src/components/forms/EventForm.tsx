import { useMemo } from 'react';
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Group, Stack, rem } from '@mantine/core';
import { type Event, type EventMainData } from 'omni-osint-crud-client';
import { useTranslation } from 'react-i18next';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import zhLocale from 'i18n-iso-countries/langs/zh.json';
import {
  EditableDate,
  EditableTags,
  EditableTitle,
  EditableText,
  EditableSelect,
  EditableTextarea,
} from '../fields';

// Register locales
countries.registerLocale(enLocale);
countries.registerLocale(zhLocale);

interface Props {
  event: Event;
  width?: number | string;
  withTitle?: boolean;
  onUpdate?: (data: EventMainData) => void;
  onClick?: () => void;
}

export const EventForm: React.FC<Props> = ({ event, width, withTitle, onUpdate, onClick }) => {
  const { t, i18n } = useTranslation();

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

  const handleLocationUpdate = (field: string, value: string | number) => {
    const newLocation = {
      latitude: 0,
      longitude: 0,
      country_code: '',
      administrative_area: '',
      sub_administrative_area: '',
      locality: '',
      sub_locality: '',
      address: '',
      postal_code: 0,
      ...(event.location || {}),
      [field]: value,
    };
    onUpdate?.({ location: newLocation });
  };

  return (
    <Stack
      gap="xs"
      mb="xl"
      style={{ width, position: 'relative', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {withTitle && (
        <EditableTitle
          value={event.title || ''}
          onChange={(val) => onUpdate?.({ title: val })}
          canEdit={!!onUpdate}
          placeholder={t('entity.event.title')}
          order={4}
        />
      )}

      <Group gap="xs" c="dimmed">
        <CalendarDaysIcon style={{ width: rem(18), height: rem(18) }} />
        <EditableDate
          value={event.happened_at || 0 * 1000}
          onChange={(date) =>
            onUpdate?.({
              happened_at: date.getTime() / 1000,
            })
          }
          canEdit={!!onUpdate}
          placeholder={t('placeholder.date')}
        />
      </Group>

      <Group gap="xs" c="dimmed" align="flex-start" wrap="nowrap">
        <MapPinIcon style={{ width: rem(18), height: rem(18), flexShrink: 0, marginTop: rem(2) }} />
        <Stack gap={0} style={{ flex: 1 }}>
          <EditableText
            value={(event.location || {}).address}
            onChange={(val) => handleLocationUpdate('address', val)}
            canEdit={!!onUpdate}
            placeholder={t('placeholder.address')}
          />
          <EditableText
            value={(event.location || {}).locality}
            onChange={(val) => handleLocationUpdate('locality', val)}
            canEdit={!!onUpdate}
            placeholder={t('placeholder.locality')}
          />
          <EditableText
            value={(event.location || {}).administrative_area}
            onChange={(val) => handleLocationUpdate('administrative_area', val)}
            canEdit={!!onUpdate}
            placeholder={t('placeholder.administrativeArea')}
          />
          <EditableSelect
            value={(event.location || {}).country_code}
            onChange={(val) => handleLocationUpdate('country_code', val)}
            canEdit={!!onUpdate}
            placeholder={t('placeholder.country')}
            data={countryOptions}
            searchable
            clearable
          />
        </Stack>
      </Group>

      <EditableTextarea
        value={event.description || ''}
        onChange={(val) => onUpdate?.({ description: val })}
        canEdit={!!onUpdate}
        placeholder={t('placeholder.description')}
      />

      <EditableTags
        value={event.tags || []}
        onChange={(tags) => onUpdate?.({ tags })}
        canEdit={!!onUpdate}
        placeholder={t('placeholder.tags')}
      />
    </Stack>
  );
};
