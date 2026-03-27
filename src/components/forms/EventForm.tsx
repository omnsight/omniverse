import { useMemo, useState, type PropsWithChildren, type CSSProperties } from 'react';
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
  Badge,
} from '@mantine/core';
import { CustomDateTimePicker } from '../inputs/CustomDateTimePicker';
import { type Event, type Source } from 'omni-osint-crud-client';
import { useTranslation } from 'react-i18next';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import zhLocale from 'i18n-iso-countries/langs/zh.json';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { EditableAttributes } from './EditableAttributes';
import { BaseForm } from './BaseForm';
import {
  EventIcon,
  EventIconSelector,
  EventColorSelector,
} from '@omnsight/osint-entity-components/icons';
import { SourceLink, AvatarSpan } from '@omnsight/osint-entity-components/avatars';

// Register locales
countries.registerLocale(enLocale);
countries.registerLocale(zhLocale);

const EventIconFormSection = ({ data }: { data: Event }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Event>();
  const { t } = useTranslation();
  const type = useWatch({ control, name: 'type' });
  const iconColor = useWatch({ control, name: 'attributes.icon_color' });

  const modifiedData = {
    ...data,
    type: type,
    attributes: { ...data.attributes, icon_color: iconColor },
  };

  return (
    <Group grow>
      <Controller
        name="type"
        control={control}
        rules={{ required: t('common.required') }}
        render={({ field }) => (
          <EventIconSelector
            {...field}
            data={modifiedData}
            value={field.value}
            error={errors.type?.message}
          />
        )}
      />
      <Controller
        name="attributes.icon_color"
        control={control}
        rules={{ required: t('common.required') }}
        render={({ field }) => (
          <EventColorSelector
            {...field}
            value={String(field.value)}
            error={errors.attributes?.icon_color?.message}
          />
        )}
      />
    </Group>
  );
};

interface Props extends PropsWithChildren {
  event: Event;
  sources?: Source[];
  useInput?: boolean;
  onSubmit?: (data: Event) => void;
  onUpdate?: (data: Partial<Event>) => void;
  onClose?: () => void;
  exitButton?: React.ReactNode;
  style?: CSSProperties;
}

export const EventForm: React.FC<Props> = ({
  event,
  sources = [],
  useInput = false,
  onSubmit,
  onUpdate,
  onClose,
  exitButton,
  children,
  style,
}) => {
  const { t, i18n } = useTranslation();
  const [attributesOpen, setAttributesOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(useInput || false);
  const canEdit = onSubmit !== undefined || onUpdate !== undefined;

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
    onClose?.();
  };

  const handleDoubleClick = () => {
    if (!useInput && canEdit) {
      setIsEditing(true);
    }
  };

  return (
    <BaseForm<Event>
      style={style}
      icon={<EventIcon event={event} />}
      title={
        isEditing ? t('components.forms.EventForm.title') : event.title || t('placeholder.title')
      }
      titleRight={
        sources && (
          <AvatarSpan showEmptyAvatar={false}>
            {sources.map((source) => (
              <SourceLink key={source._id || source._key} data={source} />
            ))}
          </AvatarSpan>
        )
      }
      isEditing={isEditing}
      onClose={handlClose}
      defaultValues={{
        ...event,
        location: {
          ...event.location,
          sub_locality: event?.location?.sub_locality || '',
          sub_administrative_area: event?.location?.sub_administrative_area || '',
        },
      }}
      onSubmit={onSubmit}
      onUpdate={onUpdate}
      exitButton={exitButton}
    >
      {({ control, formState: { errors } }) => {
        return (
          <Stack
            pos="relative"
            gap="xs"
            style={{ cursor: canEdit ? (isEditing ? 'default' : 'pointer') : 'default' }}
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

            <Group gap={4}>
              <Text size="sm" c="dimmed">
                {t('placeholder.type')}:
              </Text>
              {isEditing ? (
                <EventIconFormSection data={event} />
              ) : (
                <Text size="sm">{event.type}</Text>
              )}
            </Group>

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
                    <CustomDateTimePicker
                      value={field.value ? new Date(field.value * 1000) : null}
                      onChange={(date: Date | null) => {
                        if (date) {
                          field.onChange(date.getTime() / 1000);
                        } else {
                          field.onChange(undefined);
                        }
                      }}
                      placeholder={t('placeholder.date')}
                      error={errors.happened_at?.message}
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
                    <Text size="sm">
                      {[
                        event.location?.address,
                        event.location?.sub_locality,
                        event.location?.locality,
                        event.location?.sub_administrative_area,
                        event.location?.administrative_area,
                        event.location?.country_code
                          ? countries.getName(
                              event.location.country_code,
                              i18n.language.startsWith('zh') ? 'zh' : 'en',
                              { select: 'official' },
                            )
                          : undefined,
                        event.location?.postal_code,
                      ]
                        .filter(Boolean)
                        .join(', ') || t('placeholder.address')}
                    </Text>
                    <Group>
                      <Text size="sm">Lat: {event.location?.latitude ?? 'N/A'}</Text>
                      <Text size="sm">Lon: {event.location?.longitude ?? 'N/A'}</Text>
                    </Group>
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
              <Group gap="xs">
                {(event.tags || []).map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </Group>
            )}

            {children}

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
        );
      }}
    </BaseForm>
  );
};
