import { useEffect, useReducer } from 'react';
import {
  TextInput,
  ActionIcon,
  Popover,
  Stack,
  Text,
  Group,
  SimpleGrid,
  Button,
  rem,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  MapPinIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';
import { useAppStore } from '../utilties/useAppStore';

interface Filters {
  query: string;
  country: string;
  state: string;
  start: Date;
  end: Date;
}

export function GlobalSearch() {
  const { geoApi, setEvents } = useAppStore();
  const [filters, setFilters] = useReducer(
    (state: Filters, newState: Partial<Filters>) => ({ ...state, ...newState }),
    {
      query: '',
      country: '',
      state: '',
      start: new Date(new Date().setHours(0, 0, 0, 0)),
      end: new Date(new Date().setHours(23, 59, 59, 999)),
    }
  );

  useEffect(() => {
    geoApi.v1.geoServiceGetEvents({
      startTime: (filters.start.getTime() / 1000).toString(),
      endTime: (filters.end.getTime() / 1000).toString(),
    }).then((response) => {
      console.log('Get events response:', response.data);
      setEvents(response.data.events || [], response.data.relations || []);
    });
  }, [filters]);

  return (
    <Group gap="xs" style={{ flex: 1, maxWidth: '600px' }}>
      <div style={{ flex: 1 }}>
        <TextInput
          placeholder="Search events, entities..."
          value={filters.query}
          onChange={(e) => setFilters({ query: e.target.value })}
          leftSection={<MagnifyingGlassIcon style={{ width: rem(16) }} />}
          rightSection={
            <Popover width={400} position="bottom-end" withArrow shadow="md" trapFocus>
              <Popover.Target>
                <ActionIcon variant="transparent" color="gray">
                  <AdjustmentsHorizontalIcon style={{ width: rem(16) }} />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <Stack gap="sm">
                  <Text size="sm" fw={700} c="dimmed">
                    Advanced Filters
                  </Text>

                  {/* Location Section */}
                  <div>
                    <Group gap="xs" mb="xs">
                      <MapPinIcon style={{ width: rem(12) }} className="text-gray-500" />
                      <Text size="xs" fw={700} tt="uppercase" c="dimmed">Location</Text>
                    </Group>
                    <SimpleGrid cols={2}>
                      <TextInput
                        placeholder="Country (e.g. US)"
                        value={filters.country}
                        onChange={(e) => setFilters({ country: e.target.value })}
                      />
                      <TextInput
                        placeholder="State/Province"
                        value={filters.state}
                        onChange={(e) => setFilters({ state: e.target.value })}
                      />
                    </SimpleGrid>
                  </div>

                  {/* Date Section */}
                  <div>
                    <Group gap="xs" mb="xs" mt="xs">
                      <CalendarDaysIcon style={{ width: rem(12) }} className="text-gray-500" />
                      <Text size="xs" fw={700} tt="uppercase" c="dimmed">Time Range</Text>
                    </Group>
                    <Group grow>
                      <DateInput
                        value={filters.start}
                        onChange={(date) => date && setFilters({ start: new Date(date) })}
                        placeholder="Start Date"
                        valueFormat="YYYY/MM/DD"
                      />
                      <DateInput
                        value={filters.end}
                        onChange={(date) => date && setFilters({ end: new Date(date) })}
                        placeholder="End Date"
                        valueFormat="YYYY/MM/DD"
                      />
                    </Group>
                  </div>

                  <Button fullWidth variant="light" mt="xs">Apply Filters</Button>
                </Stack>
              </Popover.Dropdown>
            </Popover>
          }
        />
      </div>
    </Group>
  );
}