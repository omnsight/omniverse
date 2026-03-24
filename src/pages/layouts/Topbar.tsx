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
import { useEntityDataActions } from '../windows/network/entityData';
import { CountrySelect } from './CountrySelect';
import { RangeDatePicker } from './RangeDatePicker';
import { UserMenu } from './UserMenu';
import { useQueryClient } from '../../api/useQueryClient';

export const AppTopbar: React.FC = () => {
  const { t } = useTranslation();
  const { queryClient } = useQueryClient();
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
  const [searchInput, setSearchInput] = useState('');

  const { data, error, refetch } = useQuery({
    queryKey: ['global-search-entities', dateRange, country || '', searchInput],
    queryFn: async () => {
      const { data, error } = await queryEvents({
        client: queryClient,
        query: {
          date_start: Math.floor(dateRange[0]!.getTime() / 1000),
          date_end: Math.floor(dateRange[1]!.getTime() / 1000),
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
