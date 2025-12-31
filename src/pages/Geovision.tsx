import React, { useEffect, useMemo } from 'react';
import { Box } from '@mantine/core';
import { GeoMap } from '../components/map/Geomap';
import { useDataApi } from '../api/dataApi';
import { useTranslation } from 'react-i18next';
import { useLocalDataActions, useLocalDataState } from '../store/localData';
import { useQuery } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useSelection, useSelectionActions } from '../store/selection';

export const Geovision: React.FC = () => {
  const { t } = useTranslation();
  const dataApi = useDataApi();
  const { addEntities, addRelations } = useLocalDataActions();
  const { clear } = useSelectionActions();
  const selectedIds = useSelection((state) => state.selectedIds);
  const events = useLocalDataState((state) => state.events);

  useEffect(() => {
    clear();
  }, [clear]);

  const selectedEvent = useMemo(() => {
    if (selectedIds.length > 0) {
      const id = selectedIds[0];
      return events.get(id);
    }
    return undefined;
  }, [selectedIds, events]);

  const { data: relatedData, error: relatedError } = useQuery({
    queryKey: ['event-related-entities', selectedEvent?.id],
    queryFn: async () => {
      console.log('selectedEvent', selectedEvent);
      const res = await dataApi.v1.entityServiceListEntitiesFromEvent({
        startNode: selectedEvent!.id,
        depth: 1,
      });
      return res.data;
    },
    enabled: !!selectedEvent?.id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    console.log('relatedData', relatedData);
    if (relatedData) {
      addEntities(relatedData.entities || []);
      addRelations(relatedData.relations || []);
    }
  }, [relatedData, addEntities, addRelations]);

  useEffect(() => {
    if (relatedError) {
      notifications.show({
        title: t('Geovision.error'),
        message: t('Geovision.loadError'),
        color: 'red',
      });
      console.error('Failed to fetch related entities', relatedError);
    }
  }, [relatedError, t]);

  return (
    <Box style={{ height: '100%', width: '100%' }}>
      <GeoMap selectedEvent={selectedEvent} />
    </Box>
  );
};
