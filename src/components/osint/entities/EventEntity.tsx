import React from 'react';
import { Stack, Group, Text, Badge, rem, TagsInput, TextInput, Textarea, NumberInput, Fieldset } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/solid';
import type { V1Event } from '@omnsight/clients/dist/geovision/geovision.js';

interface EventEntityProps {
  event: V1Event;
  edit?: boolean;
  onUpdate?: (event: Partial<V1Event>) => void;
}

export const EventEntity: React.FC<EventEntityProps> = ({ event, edit, onUpdate }) => {
  const formatAddress = (loc: any) =>
    [loc?.address, loc?.locality, loc?.countryCode].filter(Boolean).join(', ');

  const roles = (event as any).roles || [];
  const location = (event.location || {}) as any;

  if (edit) {
    return (
      <Stack gap="md" mb="xl">
        <TextInput
          label="Title"
          value={event.title || ''}
          onChange={(e) => onUpdate?.({ title: e.currentTarget.value })}
        />

        <DateInput
          label="Happened At"
          value={event.happenedAt ? new Date(event.happenedAt) : new Date()}
          onChange={(date) => date && onUpdate?.({ happenedAt: (new Date(date).getTime() / 1000).toString() })}
          valueFormat="YYYY-MM-DD"
        />

        <Textarea
          label="Description"
          value={event.description || ''}
          onChange={(e) => onUpdate?.({ description: e.currentTarget.value })}
          minRows={3}
        />

        <Fieldset legend="Location">
          <TextInput
            label="Address"
            value={location.address || ''}
            onChange={(e) => onUpdate?.({ location: { ...location, address: e.currentTarget.value } })}
            mb="xs"
          />
          <Group grow>
            <TextInput
              label="Locality"
              value={location.locality || ''}
              onChange={(e) => onUpdate?.({ location: { ...location, locality: e.currentTarget.value } })}
            />
            <TextInput
              label="Country Code"
              value={location.countryCode || ''}
              onChange={(e) => onUpdate?.({ location: { ...location, countryCode: e.currentTarget.value } })}
            />
          </Group>
          <Group grow mt="xs">
            <NumberInput
              label="Latitude"
              value={location.latitude}
              onChange={(val) => onUpdate?.({ location: { ...location, latitude: val } })}
              decimalScale={6}
            />
            <NumberInput
              label="Longitude"
              value={location.longitude}
              onChange={(val) => onUpdate?.({ location: { ...location, longitude: val } })}
              decimalScale={6}
            />
          </Group>
        </Fieldset>

        <TagsInput
          label="Tags"
          placeholder="Enter tags"
          value={event.tags || []}
          onChange={(tags) => onUpdate?.({ tags })}
          clearable
        />

        <TagsInput
          label="Roles"
          placeholder="Enter roles"
          value={roles}
          onChange={(newRoles) => onUpdate?.({ roles: newRoles })}
          clearable
        />
      </Stack>
    );
  }

  return (
    <Stack gap="xs" mb="xl">
      <Group gap="xs" c="dimmed">
        <CalendarDaysIcon style={{ width: rem(18), height: rem(18) }} />
        <Text size="sm">{event.happenedAt ? new Date(event.happenedAt).toLocaleDateString() : 'Unknown Date'}</Text>
      </Group>

      {event.location && (
        <Group gap="xs" c="dimmed">
          <MapPinIcon style={{ width: rem(18), height: rem(18) }} />
          <Text size="sm">{formatAddress(event.location)}</Text>
        </Group>
      )}

      <Text size="md" mt="sm">{event.description}</Text>

      <Group gap="xs">
        {event.tags?.map(tag => <Badge key={tag} variant="dot">{tag}</Badge>)}
      </Group>
    </Stack>
  );
};
