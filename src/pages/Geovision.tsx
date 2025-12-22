import React, { useEffect, useState } from 'react';
import { Box } from '@mantine/core';
import { GeoMap } from '../components/map/Geomap';
import type { V1Event } from '@omnsight/clients/dist/omndapi/omndapi';
import { useDataApi } from '../api/dataApi';
import { useTranslation } from 'react-i18next';
import { useLocalDataActions } from '../store/localData';
import { useQuery } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

export const Geovision: React.FC = () => {
  const { t } = useTranslation();
  const dataApi = useDataApi();
  const { addEntities, addRelations } = useLocalDataActions();
  const [selectedEvent, setSelectedEvent] = useState<V1Event | undefined>(undefined);

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
      const entities = relatedData.entities || [];
      const relations = relatedData.relations || [];
      addEntities(entities);
      addRelations(relations);
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
      <GeoMap selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
    </Box>
  );
};
