import { useState } from 'react';
import { Autocomplete, Group, Loader, rem, Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { MapPinIcon } from '@heroicons/react/16/solid';
import type { V1LocationData } from '@omnsight/clients/dist/geovision/geovision';
import { mapNominatimToLocation } from '../utilties/mapNominatimToLocation';

interface AddressAutocompleteProps {
  onSelect: (data: V1LocationData) => void;
  zIndex?: number;
  withinPortal?: boolean;
}

export const AddressAutocomplete = ({ onSelect, zIndex, withinPortal }: AddressAutocompleteProps) => {
  const [value, setValue] = useState('');
  const [debouncedValue] = useDebouncedValue(value, 400);

  const { data, isLoading } = useQuery({
    queryKey: ['address-search', debouncedValue],
    queryFn: async () => {
      if (debouncedValue.length < 3) return [];

      const params = new URLSearchParams({
        q: debouncedValue,
        format: 'json',
        addressdetails: '1',
        limit: '5',
      });

      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
      return (await res.json()) as any[];
    },
    enabled: debouncedValue.length >= 3,
  });

  const handleSelect = (selectedValue: string) => {
    const selectedItem = data?.find((item) => item.display_name === selectedValue);

    if (selectedItem) {
      const mappedData = mapNominatimToLocation(selectedItem);
      onSelect(mappedData);
    }
  };

  return (
    <Autocomplete
      label={(
        <Group gap="xs" mb="xs">
          <MapPinIcon style={{ width: rem(14) }} className="text-gray-500" />
          <Text size="xs" fw={700} tt="uppercase" c="dimmed">地址</Text>
        </Group>
      )}
      placeholder="输入地址..."
      rightSection={isLoading ? <Loader size="xs" /> : null}
      value={value}
      onChange={setValue}
      onOptionSubmit={handleSelect}
      data={data?.map((item) => item.display_name) || []}
      filter={({ options }) => options} // Disable client-side filtering, rely on API
      comboboxProps={{ zIndex, withinPortal }}
    />
  );
};