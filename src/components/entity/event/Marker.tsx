import React from 'react';
import L from 'leaflet';
import { Marker, Tooltip as LeafletTooltip } from 'react-leaflet';
import type { V1Event } from '@omnsight/clients/dist/omndapi/omndapi.js';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { EventCard } from './Card';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Props {
  event: V1Event;
  position: [number, number];
  onClick?: () => void;
}

export const EventMarker: React.FC<Props> = ({ event, position, onClick }) => {
  return (
    <Marker
      position={position}
      icon={DefaultIcon}
      eventHandlers={{
        click: () => onClick?.(),
      }}
    >
      <LeafletTooltip>
        <EventCard event={event} width={300} />
      </LeafletTooltip>
    </Marker>
  );
};
