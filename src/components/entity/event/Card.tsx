import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Group, Text, Stack, Title, rem, Badge } from '@mantine/core';
import type { V1Event } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { useTranslation } from 'react-i18next';
import { getLocalizedAttribute } from '../common/localeSupport';

interface Props {
  event: V1Event;
  width?: number | string;
  withTitle?: boolean;
}

export const EventCard: React.FC<Props> = ({ event, width, withTitle }) => {
  const { t, i18n } = useTranslation();

  return (
    <Stack gap="xs" mb="xl" style={{ width }}>
      {withTitle && (
        <Title order={4}>
          {getLocalizedAttribute(event, 'Title', i18n.language) || event.title}
        </Title>
      )}
      <Group gap="xs" c="dimmed">
        <CalendarDaysIcon style={{ width: rem(18), height: rem(18) }} />
        <Text size="sm">
          {event.happenedAt
            ? new Date(parseInt(event.happenedAt) * 1000).toLocaleString(undefined, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })
            : t('entity.event.Card.dateUnknown')}
        </Text>
      </Group>

      <Group gap="xs" c="dimmed" align="flex-start" wrap="nowrap">
        <MapPinIcon style={{ width: rem(18), height: rem(18), flexShrink: 0 }} />
        <Text
          size="sm"
          style={{
            wordBreak: 'break-word',
            flex: 1,
            minWidth: 0,
            whiteSpace: 'normal',
          }}
        >
          {event.location?.address || t('entity.event.Card.addressUnknown')},
          {event.location?.locality || t('entity.event.Card.localityUnknown')},
          {event.location?.administrativeArea || t('entity.event.Card.administrativeAreaUnknown')},
          {event.location?.countryCode || t('entity.event.Card.countryUnknown')}
        </Text>
      </Group>

      <Text size="sm" mt="sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {getLocalizedAttribute(event, 'Description', i18n.language) || event.description}
      </Text>

      <Group gap="xs">
        {(getLocalizedAttribute(event, 'Tags', i18n.language) || event.tags)?.map((tag: string) => (
          <Badge key={tag} variant="dot">
            {tag}
          </Badge>
        ))}
      </Group>
    </Stack>
  );
};
