import React from 'react';
import L from 'leaflet';
import { Marker, Tooltip as LeafletTooltip } from 'react-leaflet';
import { type Event } from 'omni-osint-crud-client';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { EventForm } from '../../forms/EventForm';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Props {
  event: Event;
  position: [number, number];
  usePending: boolean;
  onClick?: () => void;
}

export const EventMarker: React.FC<Props> = ({ event, position, usePending, onClick }) => {
  return (
    <Marker
      position={position}
      icon={DefaultIcon}
      eventHandlers={{
        click: () => onClick?.(),
      }}
    >
      <LeafletTooltip>
        <EventForm event={event} usePending={usePending} width={300} readonly={true} />
      </LeafletTooltip>
    </Marker>
  );
};
