import React from 'react';
import { Stack, Group, Text, Badge, rem, TagsInput, TextInput, Textarea, NumberInput, Fieldset } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/solid';
import type { V1Event } from '@omnsight/clients/dist/geovision/geovision.js';
import { useTranslation } from 'react-i18next';

interface EventEntityProps {
  event: V1Event;
  edit?: boolean;
  onUpdate?: (event: Partial<V1Event>) => void;
}

export const EventEntity: React.FC<EventEntityProps> = ({ event, edit, onUpdate }) => {
  const { t } = useTranslation();
  const roles = (event as any).roles || [];
  const location = (event.location || {}) as any;

  if (edit) {
    return (
      <Stack gap="md" mb="xl">
        <TextInput
          label={t('event.title')}
          value={event.title || ''}
          onChange={(e) => onUpdate?.({ title: e.currentTarget.value })}
        />

        <DateInput
          label={t('event.happenedAt')}
          value={event.happenedAt ? new Date(event.happenedAt) : new Date()}
          onChange={(date) => date && onUpdate?.({ happenedAt: (new Date(date).getTime() / 1000).toString() })}
          valueFormat="YYYY-MM-DD"
        />

        <Textarea
          label={t('event.description')}
          value={event.description || ''}
          onChange={(e) => onUpdate?.({ description: e.currentTarget.value })}
          minRows={3}
        />

        <Fieldset legend={t('event.location')}>
          <TextInput
            label={t('event.address')}
            value={location.address || ''}
            onChange={(e) => onUpdate?.({ location: { ...location, address: e.currentTarget.value } })}
            mb="xs"
          />
          <Group grow>
            <TextInput
              label={t('event.locality')}
              value={location.locality || ''}
              onChange={(e) => onUpdate?.({ location: { ...location, locality: e.currentTarget.value } })}
            />
            <TextInput
              label={t('event.countryCode')}
              value={location.countryCode || ''}
              onChange={(e) => onUpdate?.({ location: { ...location, countryCode: e.currentTarget.value } })}
            />
          </Group>
          <Group grow mt="xs">
            <NumberInput
              label={t('event.latitude')}
              value={location.latitude}
              onChange={(val) => onUpdate?.({ location: { ...location, latitude: val } })}
              decimalScale={6}
            />
            <NumberInput
              label={t('event.longitude')}
              value={location.longitude}
              onChange={(val) => onUpdate?.({ location: { ...location, longitude: val } })}
              decimalScale={6}
            />
          </Group>
        </Fieldset>

        <TagsInput
          label={t('event.tags')}
          placeholder={t('event.enterTags')}
          value={event.tags || []}
          onChange={(tags) => onUpdate?.({ tags })}
          clearable
        />

        <TagsInput
          label={t('event.roles')}
          placeholder={t('event.enterRoles')}
          value={roles}
          onChange={(newRoles) => onUpdate?.({ roles: newRoles })}
          clearable
        />
      </Stack>
    );
  } else {
    return (
      <Stack gap="xs" mb="xl">
        <Group gap="xs" c="dimmed">
          <CalendarDaysIcon style={{ width: rem(18), height: rem(18) }} />
          <Text size="sm">{event.happenedAt ? new Date(parseInt(event.happenedAt) * 1000).toLocaleDateString() : t('event.dateUnknown')}</Text>
        </Group>

        {event.location && (
          <Group gap="xs" c="dimmed">
            <MapPinIcon style={{ width: rem(18), height: rem(18) }} />
            <Text size="sm">
              {event.location?.address || t('event.addressUnknown')}, 
              {event.location?.locality || t('event.localityUnknown')}, 
              {event.location?.administrativeArea || t('event.administrativeAreaUnknown')}, 
              {event.location?.countryCode || t('event.countryUnknown')}
            </Text>
          </Group>
        )}

        <Text size="sm" mt="sm">{event.description}</Text>

        <Group gap="xs">
          {event.tags?.map(tag => <Badge key={tag} variant="dot">{tag}</Badge>)}
        </Group>
      </Stack>
    );
  }
};
