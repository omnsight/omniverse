import { useState, useEffect } from 'react';
import {
  TextInput,
  ActionIcon,
  Popover,
  Stack,
  Text,
  Group,
  Button,
  rem,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  CalendarDateRangeIcon,
} from '@heroicons/react/24/solid';
import { useSearchState, useSearchActions } from '../utilties/useSearchState';
import { AddressAutocomplete } from './AddressAutoComplete';

export function GlobalSearch() {
  const { query, dateRange } = useSearchState();
  const { setQuery, setLocation, setDateRange } = useSearchActions();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    setDateRange([start, end]);
  }, [setDateRange]);

  return (
    <Group gap="xs" style={{ flex: 1, maxWidth: '500px' }}>
      <div style={{ flex: 1 }}>
        <Popover
          width="target"
          position="bottom"
          withArrow
          shadow="md"
          trapFocus={false}
          opened={opened}
          onChange={setOpened}
        >
          <Popover.Target>
            <TextInput
              placeholder="Search events, entities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              leftSection={<MagnifyingGlassIcon style={{ width: rem(16) }} />}
              rightSection={
                <ActionIcon variant="transparent" color="gray" onClick={() => setOpened((o) => !o)}>
                  <AdjustmentsHorizontalIcon style={{ width: rem(16) }} />
                </ActionIcon>
              }
            />
          </Popover.Target>
          <Popover.Dropdown>
            <Stack gap="sm">
              <Text size="sm" fw={700} c="dimmed">
                高级搜索
              </Text>

              {/* Location Section */}
              <AddressAutocomplete onSelect={setLocation} withinPortal={false} />

              {/* Date Section */}
              <div>
                <Group gap="xs" mb="xs" mt="xs">
                  <CalendarDaysIcon style={{ width: rem(12) }} className="text-gray-500" />
                  <Text size="xs" fw={700} tt="uppercase" c="dimmed">日期范围</Text>
                </Group>
                <Group grow>
                  <DateTimePicker
                    placeholder="Start date"
                    popoverProps={{ withinPortal: false }}
                    value={dateRange[0]}
                    onChange={(date) => {
                      date && setDateRange([new Date(date), dateRange[1]]);
                    }}
                    clearable
                    leftSection={<CalendarDateRangeIcon style={{ width: rem(16) }} />}
                  />
                  <DateTimePicker
                    placeholder="End date"
                    popoverProps={{ withinPortal: false }}
                    value={dateRange[1]}
                    onChange={(date) => {
                      date && setDateRange([dateRange[0], new Date(date)]);
                    }}
                    clearable
                    leftSection={<CalendarDateRangeIcon style={{ width: rem(16) }} />}
                  />
                </Group>
              </div>

              <Button fullWidth variant="light" mt="xs">搜索</Button>
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </div>
    </Group>
  );
}