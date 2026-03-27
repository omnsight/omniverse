import React from 'react';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Marker } from 'react-leaflet';
import { type Event } from 'omni-osint-crud-client';
import { EventIcon } from '@omnsight/osint-entity-components/icons';
import { MantineProvider } from '@mantine/core';

interface Props {
  event: Event;
  position: [number, number];
  onClick?: (e: L.LeafletMouseEvent) => void;
}

export const EventMarker: React.FC<Props> = ({ event, position, onClick }) => {
  const customEventIcon = L.divIcon({
    html: renderToStaticMarkup(
      <MantineProvider>
        <EventIcon event={event} size={30} />
      </MantineProvider>,
    ),
    className: 'custom-event-marker', // Keeps the background transparent
    iconSize: [30, 30],
    iconAnchor: [15, 30], // Centers the icon horizontally, anchors bottom
  });

  return (
    <Marker
      position={position}
      icon={customEventIcon}
      eventHandlers={{
        click: (e) => onClick?.(e),
      }}
    />
  );
};
