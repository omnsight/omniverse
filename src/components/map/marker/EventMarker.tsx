import React from 'react';
import L from 'leaflet';
import { Marker, Tooltip } from 'react-leaflet';
import { type Event } from 'omni-osint-crud-client';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Props {
  event: Event;
  position: [number, number];
  onClick?: (e: L.LeafletMouseEvent) => void;
}

export const EventMarker: React.FC<Props> = ({ event, position, onClick }) => {
  return (
    <Marker
      position={position}
      icon={DefaultIcon}
      eventHandlers={{
        click: (e) => onClick?.(e),
      }}
    />
  );
};
