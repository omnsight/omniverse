import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@mantine/hooks';
import { useGeoApi } from './useGeoApi';
import { useSearchState } from './useSearchState';

export const useGlobalSearch = () => {
  const api = useGeoApi();
  const { query, location, dateRange } = useSearchState();
  const [debouncedQuery] = useDebouncedValue(query, 300);

  const isDateReady = !dateRange[0] || (!!dateRange[0] && !!dateRange[1]);
  return useQuery({
    queryKey: ['global-search', debouncedQuery, location, dateRange],
    queryFn: () => api.v1.geoServiceGetEvents({
      startTime: Math.floor(dateRange[0]!.getTime() / 1000).toString(),
      endTime: Math.floor(dateRange[1]!.getTime() / 1000).toString(),
    }),
    enabled: isDateReady,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });
};