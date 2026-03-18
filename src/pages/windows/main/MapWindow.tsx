import React from 'react';
import { useEntityDataStore } from '../network/entityData';
import { useSelectedEntities } from '../data/entitySelection';
import { useEntitySelectionActions } from '../data/entitySelection';
import { GeoMap } from '../../../components/map/Map';

export const MapWindow: React.FC = () => {
  const { events, relations } = useEntityDataStore();
  const selections = useSelectedEntities();
  const { setSelections, addSelections } = useEntitySelectionActions();

  const selectedEvent = selections.find((e) => e.type === 'Event')?.data;

  const setSelected = (id: string, multiSelect: boolean) => {
    if (multiSelect) {
      addSelections([id]);
    } else {
      setSelections([id]);
    }
  };

  return (
    <GeoMap
      events={events}
      relations={relations}
      selected={selectedEvent}
      setSelected={setSelected}
    />
  );
};
