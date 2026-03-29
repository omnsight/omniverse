import React, { useState, useEffect } from 'react';
import {
  AppShell,
  Group,
  Popover,
  Button,
  rem,
  TextInput,
  ActionIcon,
  Menu,
  Stack,
  Box,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { queryEvents } from 'omni-osint-query-client';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { useEntityDataActions } from '../windows/network/entityData';
import { CountrySelect, RangeDatePicker, TimezoneSelectComponent } from '@omnsight/osint-entity-components/inputs';
import { UserMenu } from './UserMenu';
import { useEntityQueryClient } from '../../api/useQueryClient';
import { useWindowStoreActions } from '@/stores/windowState';

export const AppTopbar: React.FC = () => {
  const { t } = useTranslation();
  const { setActiveWindow } = useWindowStoreActions();
  const { entityQueryClient } = useEntityQueryClient();
  const { setEntities } = useEntityDataActions();
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [timezone, setTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>(() => {
    const now = new Date();
    const start = toZonedTime(now, timezone);
    start.setHours(0, 0, 0, 0);
    const end = toZonedTime(now, timezone);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  });
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const { data, error, refetch } = useQuery({
    queryKey: ['global-search-entities', dateRange, country || '', searchInput, timezone],
    queryFn: async () => {
      const utcStart = fromZonedTime(dateRange[0]!, timezone);
      const utcEnd = fromZonedTime(dateRange[1]!, timezone);
      const { data, error } = await queryEvents({
        client: entityQueryClient,
        query: {
          date_start: Math.floor(utcStart.getTime() / 1000),
          date_end: Math.floor(utcEnd.getTime() / 1000),
          country_code: country,
          query: searchInput,
        },
      });
      if (error) {
        console.error('Error fetching global search entities', error);
        throw error;
      }
      console.debug('Fetched global search entities', data);
      return data;
    },
    enabled: false,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data) {
      setEntities(
        {
          events: data.events || [],
          relations: data.relations || [],
        },
        ['global-search-entities', dateRange, country || ''],
      );
    }
  }, [data, setEntities]);

  useEffect(() => {
    if (data?.events?.length || data?.relations?.length) {
      setActiveWindow('network', 'Spark');
      setActiveWindow('data', 'EntityList');
    }
  }, [data, setActiveWindow]);

  useEffect(() => {
    if (error) {
      notifications.show({
        title: t('common.error'),
        message: t('pages.layouts.Topbar.queryEntitiesError'),
        color: 'red',
      });
      console.error('Failed to query entities', error);
    }
  }, [error, t]);

  const formatDateRange = (range: [Date | undefined, Date | undefined]) => {
    if (!range[0]) return t('pages.layouts.Topbar.selectDateRange', '?');
    const startStr = range[0].toLocaleDateString();
    const endStr = range[1] ? range[1].toLocaleDateString() : '...';
    return `${startStr} - ${endStr}`;
  };

  const handleSearch = () => {
    if (dateRange[0] && dateRange[1]) {
      refetch();
    }
  };

  const handleReset = () => {
    setSearchInput('');
    setCountry(undefined);
    setDateRange([undefined, undefined]);
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  };

  return (
    <AppShell.Header p="xs">
      <Group justify="space-between">
        <Group>
          <Group
            pl="xs"
            pr="xs"
            gap="sm"
            wrap="nowrap"
            style={(theme) => ({
              border: `${rem(1)} solid ${theme.colors.gray[4]}`,
              borderRadius: theme.radius.sm,
            })}
          >
            <ActionIcon variant="default" color="gray" size="md" onClick={handleSearch}>
              <MagnifyingGlassIcon style={{ width: rem(16) }} />
            </ActionIcon>
            <TextInput
              variant="unstyled"
              placeholder={t('pages.layouts.Topbar.searchPlaceholder')}
              size="md"
              value={searchInput}
              onChange={(event) => setSearchInput(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Menu withArrow shadow="md">
              <Menu.Target>
                <ActionIcon variant="default" color="gray" size="md">
                  <AdjustmentsHorizontalIcon style={{ width: rem(16) }} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown p="md">
                <Menu.Label mb="xs" p={0} style={{ fontSize: rem(14), fontWeight: 700 }}>
                  {t('pages.layouts.Topbar.searchFilters')}
                </Menu.Label>
                <Stack gap="sm">
                  <Box>
                    <Text size="xs" fw={500} mb={4} c="dimmed">
                      {t('pages.layouts.Topbar.country')}
                    </Text>
                    <CountrySelect country={country} setCountry={setCountry} />
                  </Box>
                  <Box>
                    <Text size="xs" fw={500} mb={4} c="dimmed">
                      {t('pages.layouts.Topbar.timezone')}
                    </Text>
                    <TimezoneSelectComponent timezone={timezone} setTimezone={setTimezone} />
                  </Box>
                </Stack>
                <Group justify="flex-end" mt="md">
                  <Button variant="subtle" size="xs" color="gray" onClick={handleReset}>
                    {t('common.reset')}
                  </Button>
                  <Button size="xs" onClick={handleSearch}>
                    {t('common.apply')}
                  </Button>
                </Group>
              </Menu.Dropdown>
            </Menu>
          </Group>

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
