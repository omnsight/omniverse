import React, { useState, useEffect } from 'react';
import { AppShell, Group, Popover, Button, rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { queryEvents } from 'omni-osint-query-client';
import { useEntityDataActions } from '../windows/network/entityData';
import { CountrySelect } from './CountrySelect';
import { RangeDatePicker } from './RangeDatePicker';
import { UserMenu } from './UserMenu';

export const AppTopbar: React.FC = () => {
  const { t } = useTranslation();
  const { setEntities } = useEntityDataActions();
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return [start, end];
  });
  const [popoverOpened, setPopoverOpened] = useState(false);

  const { data, isError, error } = useQuery({
    queryKey: ['global-search-entities', dateRange, country || ''],
    queryFn: async () =>
      await queryEvents({
        body: {
          date_start: Math.floor(dateRange[0]!.getTime() / 1000),
          date_end: Math.floor(dateRange[1]!.getTime() / 1000),
          country_code: country,
        },
      }),
    enabled: !!dateRange[0] && !!dateRange[1],
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (data?.data) {
      setEntities(
        {
          events: data.data.events || [],
          relations: data.data.relations || [],
        },
        ['global-search-entities', dateRange, country || ''],
      );
    }
  }, [data, setEntities]);

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: t('common.error'),
        message: t('layout.Topbar.queryEntitiesError'),
        color: 'red',
      });
      console.error('Failed to query entities', error);
    }
  }, [isError, error, t]);

  const formatDateRange = (range: [Date | undefined, Date | undefined]) => {
    if (!range[0]) return t('layout.Topbar.selectDateRange');
    const startStr = range[0].toLocaleDateString();
    const endStr = range[1] ? range[1].toLocaleDateString() : '...';
    return `${startStr} - ${endStr}`;
  };

  return (
    <AppShell.Header p="xs">
      <Group justify="space-between">
        <Group>
          <CountrySelect country={country} setCountry={setCountry} />

          <Popover
            opened={popoverOpened}
            onChange={setPopoverOpened}
            position="bottom-start"
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <Button
                variant="default"
                leftSection={<CalendarDaysIcon style={{ width: rem(16) }} />}
                onClick={() => setPopoverOpened((o) => !o)}
              >
                {formatDateRange(dateRange)}
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <RangeDatePicker dateRange={dateRange} setDateRange={setDateRange} />
            </Popover.Dropdown>
          </Popover>
        </Group>

        <UserMenu />
      </Group>
    </AppShell.Header>
  );
};
