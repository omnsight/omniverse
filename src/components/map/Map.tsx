import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Box, useMantineColorScheme } from '@mantine/core';
import type { Event } from 'omni-osint-crud-client';
import { useFilteredEventsAndRelations } from './localData';
import { MapFlyer } from './MapFly';
import { MapConstraint } from './MapConstraint';
import { getMinZoomForScreen } from './mapUtils';
import { MapTools } from './MapTools';
import { EventMarker } from './marker/EventMarker';
import { EventWindow } from '../models/event/Window';
import { useSelectionActions } from '../../store/selection';
import { useMapToolState } from './mapToolState';

interface Props {
  selectedEvent?: Event | undefined;
}

export const GeoMap: React.FC<Props> = ({ selectedEvent }) => {
  const { colorScheme } = useMantineColorScheme();
  const { events, relations } = useFilteredEventsAndRelations();
  const { select, clear } = useSelectionActions();

  const toolMode = useMapToolState((state) => state.mode);

  const getCoords = (e?: Event): [number, number] | undefined => {
    if (!e || !e.location || !e.location.latitude || !e.location.longitude) return undefined;
    return [e.location.latitude, e.location.longitude];
  };

  return (
    <Box style={{ height: '100%', width: '100%', position: 'relative' }}>
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
              key={event.id || event.key || idx}
              event={event}
              position={coords}
              onClick={() => {
                if (toolMode === 'normal' && event.id) {
                  clear();
                  select([event.id]);
                }
              }}
            />
          );
        })}

        {/* Relations */}
        {relations.map((rel, idx) => {
          const sourceEvent = events.find((e) => e.id === rel.from);
          const targetEvent = events.find((e) => e.id === rel.to);

          if (sourceEvent && targetEvent) {
            const sourceCoords = getCoords(sourceEvent);
            const targetCoords = getCoords(targetEvent);
            if (sourceCoords && targetCoords) {
              return (
                <Polyline
                  key={idx}
                  positions={[sourceCoords, targetCoords]}
                  color="blue"
                  weight={2}
                  opacity={0.6}
                  dashArray="5, 10"
                />
              );
            }
          }
          return null;
        })}

        {/* Auto-center map when event is selected */}
        {selectedEvent && getCoords(selectedEvent) && (
          <MapFlyer center={getCoords(selectedEvent!)} />
        )}

        {/* Vertical constraint */}
        <MapConstraint />
      </MapContainer>

      {selectedEvent && (
        <EventWindow isOpen={!!selectedEvent} onClose={() => clear()} event={selectedEvent} />
      )}
    </Box>
  );
};
