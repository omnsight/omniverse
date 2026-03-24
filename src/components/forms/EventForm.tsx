import { useMemo, useState } from 'react';
import { CalendarDaysIcon, ChevronDownIcon, MapPinIcon } from '@heroicons/react/24/outline';
import {
  Collapse,
  Divider,
  Group,
  Stack,
  Title,
  UnstyledButton,
  rem,
  Text,
  TextInput,
  Textarea,
  Select,
  TagsInput,
  NumberInput,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { type Event } from 'omni-osint-crud-client';
import { useTranslation } from 'react-i18next';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import zhLocale from 'i18n-iso-countries/langs/zh.json';
import { Controller } from 'react-hook-form';
import { EditableAttributes } from './EditableAttributes';
import { BaseForm } from './BaseForm';

// Register locales
countries.registerLocale(enLocale);
countries.registerLocale(zhLocale);

interface Props {
  event: Event;
  width?: number | string;
  useInput?: boolean;
  onSubmit?: (data: Event) => void;
  onUpdate?: (data: Partial<Event>) => void;
  onClose: () => void;
  onClick?: () => void;
}

export const EventForm: React.FC<Props> = ({
  event,
  width,
  useInput = false,
  onSubmit,
  onUpdate,
  onClose,
  onClick,
}) => {
  const { t, i18n } = useTranslation();
  const [attributesOpen, setAttributesOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(useInput || false);

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

  const handlClose = () => {
    if (!useInput) {
      setIsEditing(false);
    }
    onClose();
  };

  const handleDoubleClick = () => {
    if (!useInput) {
      setIsEditing(true);
    }
  };

  return (
    <BaseForm<Event>
      title={
        isEditing
          ? t('components.forms.EventForm.editingTitle')
          : event.title || t('components.forms.EventForm.title')
      }
      isEditing={isEditing}
      onClose={handlClose}
      defaultValues={{
        ...event,
        location: {
          ...event.location,
          sub_locality: event?.location?.sub_locality || '',
          sub_administrative_area: event?.location?.sub_administrative_area || '',
        }
      }}
      onSubmit={onSubmit}
      onUpdate={onUpdate}
    >
      {({ control, formState: { errors } }) => (
        <Stack
          gap="xs"
          style={{ width, position: 'relative', cursor: onClick ? 'pointer' : 'default' }}
          onClick={onClick}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing && (
            <Text size="sm" fw={500}>
              {t('components.forms.EventForm.title')}
            </Text>
          )}
          {isEditing && (
            <Controller
              name="title"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  value={field.value || ''}
                  placeholder={t('components.forms.EventForm.title')}
                  error={errors.title?.message}
                />
              )}
            />
          )}

          {isEditing && (
            <Text size="sm" fw={500}>
              {t('placeholder.date')}
            </Text>
          )}
          <Group gap="xs" c="dimmed">
            <CalendarDaysIcon style={{ width: rem(18), height: rem(18) }} />
            {isEditing ? (
              <Controller
                name="happened_at"
                control={control}
                rules={{ required: t('common.required') }}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    value={field.value ? new Date(field.value * 1000) : null}
                    onChange={(date) => {
                        const newDate = date ? new Date(date) : null;
                        if (newDate && !isNaN(newDate.getTime())) {
                          field.onChange(newDate.getTime() / 1000);
                        } else {
                          field.onChange(undefined);
                        }
                      }}
                    placeholder={t('placeholder.date')}
                  />
                )}
              />
            ) : (
              <Text size="sm">
                {event.happened_at
                  ? new Date(event.happened_at * 1000).toLocaleDateString()
                  : t('placeholder.date')}
              </Text>
            )}
          </Group>

          {isEditing && (
            <Text size="sm" fw={500}>
              {t('placeholder.location')}
            </Text>
          )}
          <Group gap="xs" c="dimmed" align="flex-start" wrap="nowrap">
            <MapPinIcon
              style={{ width: rem(18), height: rem(18), flexShrink: 0, marginTop: rem(2) }}
            />
            <Stack gap={0} style={{ flex: 1 }}>
              {isEditing ? (
                <>
                  <Controller
                    name="location.address"
                    control={control}
                    rules={{ required: t('common.required') }}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        value={field.value || ''}
                        placeholder={t('placeholder.address')}
                        error={errors.location?.address?.message}
                      />
                    )}
                  />
                  <Group grow>
                    <Controller
                      name="location.locality"
                      control={control}
                      rules={{ required: t('common.required') }}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          value={field.value || ''}
                          placeholder={t('placeholder.locality')}
                          error={errors.location?.locality?.message}
                        />
                      )}
                    />
                    <Controller
                      name="location.sub_locality"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          value={field.value || ''}
                          placeholder={t('placeholder.subLocality')}
                        />
                      )}
                    />
                  </Group>
                  <Group grow>
                    <Controller
                      name="location.administrative_area"
                      control={control}
                      rules={{ required: t('common.required') }}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          value={field.value || ''}
                          placeholder={t('placeholder.adminArea')}
                          error={errors.location?.administrative_area?.message}
                        />
                      )}
                    />
                    <Controller
                      name="location.sub_administrative_area"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          value={field.value || ''}
                          placeholder={t('placeholder.subAdminArea')}
                        />
                      )}
                    />
                  </Group>
                  <Group grow>
                    <Controller
                      name="location.latitude"
                      control={control}
                      rules={{
                        required: t('common.required'),
                        min: {
                          value: -90,
                          message: t('components.forms.EventForm.minLatitude-90-90'),
                        },
                        max: {
                          value: 90,
                          message: t('components.forms.EventForm.maxLatitude'),
                        },
                      }}
                      render={({ field }) => (
                        <NumberInput
                          {...field}
                          value={field.value}
                          placeholder={t('placeholder.latitude')}
                          error={errors.location?.latitude?.message}
                        />
                      )}
                    />
                    <Controller
                      name="location.longitude"
                      control={control}
                      rules={{
                        required: t('common.required'),
                        min: {
                          value: -180,
                          message: t('components.forms.EventForm.minLongitude-180-180'),
                        },
                        max: {
                          value: 180,
                          message: t('components.forms.EventForm.maxLongitude'),
                        },
                      }}
                      render={({ field }) => (
                        <NumberInput
                          {...field}
                          value={field.value}
                          placeholder={t('placeholder.longitude')}
                          error={errors.location?.longitude?.message}
                        />
                      )}
                    />
                  </Group>
                  <Controller
                    name="location.country_code"
                    control={control}
                    rules={{ required: t('common.required') }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ''}
                        placeholder={t('placeholder.country')}
                        data={countryOptions}
                        searchable
                        clearable
                        error={errors.location?.country_code?.message}
                      />
                    )}
                  />
                  <Controller
                    name="location.postal_code"
                    control={control}
                    rules={{ required: t('common.required') }}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        value={field.value || ''}
                        placeholder={t('placeholder.postalCode')}
                        error={errors.location?.postal_code?.message}
                      />
                    )}
                  />
                </>
              ) : (
                <>
                  <Text size="sm">{event.location?.address || t('placeholder.address')}</Text>
                  <Text size="sm">{event.location?.locality || t('placeholder.locality')}</Text>
                  <Text size="sm">
                    {event.location?.sub_locality || t('placeholder.subLocality')}
                  </Text>
                  <Text size="sm">
                    {event.location?.administrative_area || t('placeholder.adminArea')}
                  </Text>
                  <Text size="sm">
                    {event.location?.sub_administrative_area || t('placeholder.subAdminArea')}
                  </Text>
                  <Group>
                    <Text size="sm">Lat: {event.location?.latitude ?? 'N/A'}</Text>
                    <Text size="sm">Lon: {event.location?.longitude ?? 'N/A'}</Text>
                  </Group>
                  <Text size="sm">
                    {event.location?.country_code
                      ? countries.getName(
                          event.location.country_code,
                          i18n.language.startsWith('zh') ? 'zh' : 'en',
                          { select: 'official' },
                        )
                      : t('placeholder.country')}
                  </Text>
                  <Text size="sm">
                    {event.location?.postal_code || t('placeholder.postalCode')}
                  </Text>
                </>
              )}
            </Stack>
          </Group>

          {isEditing && (
            <Text size="sm" fw={500}>
              {t('placeholder.description')}
            </Text>
          )}
          {isEditing ? (
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder={t('components.forms.EventForm.eventDescription')}
                />
              )}
            />
          ) : (
            <Text size="sm">
              {event.description || t('components.forms.EventForm.eventDescription')}
            </Text>
          )}

          {isEditing && (
            <Text size="sm" fw={500}>
              {t('placeholder.tags')}
            </Text>
          )}
          {isEditing ? (
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TagsInput
                  {...field}
                  value={field.value || []}
                  placeholder={t('placeholder.tags')}
                />
              )}
            />
          ) : (
            <Text size="sm">{(event.tags || []).join(', ')}</Text>
          )}

          <Divider my="sm" />

          <UnstyledButton onClick={() => setAttributesOpen((o) => !o)}>
            <Group justify="space-between">
              <Title order={5}>{t('placeholder.attributes')}</Title>
              <ChevronDownIcon
                style={{
                  width: 16,
                  transform: attributesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 200ms ease',
                }}
              />
            </Group>
          </UnstyledButton>

          <Collapse in={attributesOpen}>
            <Controller
              name="attributes"
              control={control}
              render={({ field }) => (
                <EditableAttributes {...field} value={field.value || {}} isEditing={isEditing} />
              )}
            />
          </Collapse>
        </Stack>
      )}
    </BaseForm>
  );
};
