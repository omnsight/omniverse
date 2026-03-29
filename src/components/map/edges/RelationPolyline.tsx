import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Polyline } from 'react-leaflet';
import type { Event, Relation } from 'omni-osint-crud-client';

interface Props {
  events: Event[];
  relation: Relation;
}

export const RelationPolyline: React.FC<Props> = ({ events, relation }) => {
  const getCoords = (e?: Event): [number, number] | undefined => {
    if (!e || !e.location || !e.location.latitude || !e.location.longitude) return undefined;
    return [e.location.latitude, e.location.longitude];
  };

  const sourceEvent = events.find((e) => e._id === relation._from);
  const targetEvent = events.find((e) => e._id === relation._to);
  const sourceCoords = getCoords(sourceEvent);
  const targetCoords = getCoords(targetEvent);

  if (!sourceCoords || !targetCoords) return null;

  return (
    <Polyline
      key={relation._id}
      positions={[sourceCoords, targetCoords]}
      color="blue"
      weight={2}
      opacity={0.6}
      dashArray="5, 10"
    />
  );
};
