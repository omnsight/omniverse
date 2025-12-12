import React, { useState, useEffect } from 'react';
import { Stack, Group, Text, Badge, rem, TagsInput, TextInput, Textarea, NumberInput, Divider, Box, Title, Button, ActionIcon } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { CalendarDaysIcon, MapPinIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { CheckIcon } from '@heroicons/react/24/outline';
import type { V1Event, V1LocationData } from '@omnsight/clients/dist/geovision/geovision.js';
import { useTranslation } from 'react-i18next';
import { Marker, Tooltip as LeafletTooltip } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface EventEntityProps {
  event: V1Event;
  edit?: boolean;
  width?: number | string;
  withTitle?: boolean;
  onUpdate?: (event: Partial<V1Event>) => void;
  onClose?: () => void;
}

export const EventEntity: React.FC<EventEntityProps> = ({ event, edit, width, withTitle = true, onUpdate, onClose }) => {
  const { t } = useTranslation();
  
  const [localEvent, setLocalEvent] = useState<V1Event>(event);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalEvent(event);
    setIsDirty(false);
  }, [event]);

  const handleLocalUpdate = (updates: Partial<V1Event>) => {
    setLocalEvent(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const roles = localEvent.roles || [];
  const location: V1LocationData = localEvent.location || {};

  if (edit) {
    return (
      <Stack gap="md" mb="xl" style={{ width }}>
        <Group justify="space-between">
          {onUpdate && (
            <Button
              variant="light"
              color='green'
              leftSection={<CheckIcon style={{ width: rem(18) }} />}
              disabled={!isDirty}
              onClick={() => {
                onUpdate(localEvent);
                setIsDirty(false);
              }}
            >
              {isDirty ? 'Save' : 'Saved'}
            </Button>
          )}
          {onClose && (
            <ActionIcon variant="subtle" color="red" onClick={onClose}>
              <XMarkIcon style={{ width: rem(20), height: rem(20) }} />
            </ActionIcon>
          )}
        </Group>

        <TextInput
          label={t('event.title')}
          placeholder={t('event.enterTitle')}
          value={localEvent.title || ''}
          onChange={(e) => handleLocalUpdate({ title: e.currentTarget.value })}
        />

        <DateTimePicker
          label={t('event.happenedAt')}
          placeholder={t('event.selectDate')}
          value={localEvent.happenedAt ? new Date(parseInt(localEvent.happenedAt) * 1000) : undefined}
          onChange={(date) => date && handleLocalUpdate({ happenedAt: (new Date(date).getTime() / 1000).toString() })}
          valueFormat="YYYY-MM-DD HH:mm"
        />

        <Textarea
          label={t('event.description')}
          placeholder={t('event.enterDescription')}
          value={localEvent.description || ''}
          onChange={(e) => handleLocalUpdate({ description: e.currentTarget.value })}
          autosize
          minRows={6}
        />

        <Box>
          <Divider label={t('event.location')} labelPosition="left" mb="xs" />
          <Stack gap="xs">
            <TextInput
              label={t('event.address')}
              placeholder={t('event.enterAddress')}
              value={location.address || ''}
              onChange={(e) => handleLocalUpdate({ location: { ...location, address: e.currentTarget.value } })}
            />
            <Group grow>
              <TextInput
                label={t('event.locality')}
                placeholder={t('event.enterLocality')}
                value={location.locality || ''}
                onChange={(e) => handleLocalUpdate({ location: { ...location, locality: e.currentTarget.value } })}
              />
              <TextInput
                label={t('event.countryCode')}
                placeholder={t('event.enterCountryCode')}
                value={location.countryCode || ''}
                onChange={(e) => handleLocalUpdate({ location: { ...location, countryCode: e.currentTarget.value } })}
              />
            </Group>
            <Group grow>
              <NumberInput
                label={t('event.latitude')}
                placeholder={t('event.enterLatitude')}
                value={location.latitude}
                onChange={(val) => val && handleLocalUpdate({ location: { ...location, latitude: Number(val) } })}
                decimalScale={6}
              />
              <NumberInput
                label={t('event.longitude')}
                placeholder={t('event.enterLongitude')}
                value={location.longitude}
                onChange={(val) => val && handleLocalUpdate({ location: { ...location, longitude: Number(val) } })}
                decimalScale={6}
              />
            </Group>
          </Stack>
        </Box>

        <TagsInput
          label={t('event.tags')}
          placeholder={t('event.enterTags')}
          value={localEvent.tags || []}
          onChange={(tags) => handleLocalUpdate({ tags })}
          clearable
        />

        <TagsInput
          label={t('event.roles')}
          placeholder={t('event.enterRoles')}
          value={roles}
          onChange={(newRoles) => handleLocalUpdate({ roles: newRoles })}
          clearable
        />
      </Stack>
    );
  } else {
    return (
      <Stack gap="xs" mb="xl" style={{ width }}>
        {withTitle && <Title order={4}>{event.title}</Title>}
        <Group gap="xs" c="dimmed">
          <CalendarDaysIcon style={{ width: rem(18), height: rem(18) }} />
          <Text size="sm">{event.happenedAt ? new Date(parseInt(event.happenedAt) * 1000).toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) : t('event.dateUnknown')}</Text>
        </Group>

        {event.location && (
          <Group gap="xs" c="dimmed" align="flex-start" wrap="nowrap">
            <MapPinIcon style={{ width: rem(18), height: rem(18), flexShrink: 0 }} />
            <Text size="sm" style={{ wordBreak: 'break-word', flex: 1, minWidth: 0, whiteSpace: 'normal' }}>
              {event.location?.address || t('event.addressUnknown')},
              {event.location?.locality || t('event.localityUnknown')},
              {event.location?.administrativeArea || t('event.administrativeAreaUnknown')},
              {event.location?.countryCode || t('event.countryUnknown')}
            </Text>
          </Group>
        )}

        <Text size="sm" mt="sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{event.description}</Text>

        <Group gap="xs">
          {event.tags?.map(tag => <Badge key={tag} variant="dot">{tag}</Badge>)}
        </Group>
      </Stack>
    );
  }
};

interface EventMarkerProps {
  event: V1Event;
  position: [number, number];
  onClick?: () => void;
}

export const EventMarker: React.FC<EventMarkerProps> = ({ event, position, onClick }) => {
  return (
    <Marker
      position={position}
      icon={DefaultIcon}
      eventHandlers={{
        click: () => onClick?.()
      }}
    >
      <LeafletTooltip>
        <EventEntity event={event} width={300} />
      </LeafletTooltip>
    </Marker>
  );
};

