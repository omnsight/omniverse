import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Box, useMantineColorScheme } from '@mantine/core';
import type { Event, Relation } from 'omni-osint-crud-client';
import { MapFlyer } from './MapFly';
import { MapConstraint } from './MapConstraint';
import { getMinZoomForScreen } from './mapUtils';
import { MapTools } from './MapTools';
import { EventMarker } from './marker/EventMarker';
import { useMapToolState } from './mapToolState';
import { RelationPolyline } from './edges/RelationPolyline';

interface Props {
  events: Event[];
  relations: Relation[];
  selected?: Event;
  setSelected: (id: string, multiSelect: boolean) => void;
}

export const GeoMap: React.FC<Props> = ({ events, relations, selected, setSelected }) => {
  const { colorScheme } = useMantineColorScheme();

  const toolMode = useMapToolState((state) => state.mode);

  const getCoords = (e?: Event): [number, number] | undefined => {
    if (!e || !e.location || !e.location.latitude || !e.location.longitude) return undefined;
    return [e.location.latitude, e.location.longitude];
  };

  return (
    <Box pos="relative" h="100%" w="100%">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        zoomControl={false}
        minZoom={getMinZoomForScreen()}
        maxBounds={[
          [-90, -Infinity],
          [90, Infinity],
        ]}
        maxBoundsViscosity={1.0}
        style={{
          height: '100%',
          width: '100%',
          cursor: toolMode === 'ruler' ? 'crosshair' : 'grab',
        }}
      >
        <TileLayer
          url={
            colorScheme === 'dark'
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
          attribution={
            colorScheme === 'dark'
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        />

        {/* Map Tools (Ruler, Mode Switcher) */}
        <MapTools />

        {/* Events */}
        {events.map((event, idx) => {
          const coords = getCoords(event);
          if (!coords) return null;
          return (
            <EventMarker
              key={event._id || event._key || idx}
              event={event}
              position={coords}
              onClick={(e) => {
                if (toolMode === 'normal' && event._id) {
                  setSelected(event._id, e.originalEvent.shiftKey);
                }
              }}
            />
          );
        })}

        {/* Relations */}
        {toolMode === 'relations' &&
          relations.map((rel, idx) => (
            <RelationPolyline key={rel._id || idx} events={events} relation={rel} />
          ))}

        {/* Auto-center map when event is selected */}
        {selected && getCoords(selected) && <MapFlyer center={getCoords(selected)} />}

        {/* Vertical constraint */}
        <MapConstraint />
      </MapContainer>
    </Box>
  );
};
