import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EventWindow } from './EventWindow';
import type { V1Event, V1Relation } from '@omnsight/clients/dist/geovision/geovision.js';
import { Box, useMantineColorScheme } from '@mantine/core';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { getMinZoomForScreen, VerticalConstraint } from './MapZoomConstraint';
import { MapTools, type ToolMode } from './MapTools';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function MapUpdater({ center }: { center: [number, number] | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

interface EventMapProps {
  events: V1Event[];
  relations: V1Relation[];
  selectedEvent?: V1Event;
  onEventSelect: (event: V1Event | undefined) => void;
}

export const EventMap: React.FC<EventMapProps> = ({ events, relations, selectedEvent, onEventSelect }) => {
  const { colorScheme } = useMantineColorScheme();
  
  // Tool state: 'normal' | 'ruler'
  const [toolMode, setToolMode] = useState<ToolMode>('normal');

  const getCoords = (e?: V1Event): [number, number] | undefined => {
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
        maxBounds={[[-90, -Infinity], [90, Infinity]]}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', cursor: toolMode === 'ruler' ? 'crosshair' : 'grab' }}
      >
        <TileLayer
          url={colorScheme === 'dark'
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
          attribution={colorScheme === 'dark'
            ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        />

        {/* Map Tools (Ruler, Mode Switcher) */}
        <MapTools 
          mode={toolMode} 
          onChangeMode={(newMode) => {
            setToolMode(newMode);
            if (newMode === 'ruler') {
              onEventSelect(undefined);
            }
          }} 
        />

        {/* Events */}
        {events.map((event) => {
          const coords = getCoords(event);
          if (!coords) return null;
          return (
            <Marker
              key={event.key || Math.random().toString()}
              position={coords}
              icon={DefaultIcon}
              eventHandlers={{
                click: () => {
                  if (toolMode === 'normal') {
                    onEventSelect(event);
                  }
                }
              }}
            />
          );
        })}

        {/* Relations */}
        {relations.map((rel, idx) => {
          const sourceEvent = events.find(e => e.id === rel.from);
          const targetEvent = events.find(e => e.id === rel.to);

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
          <MapUpdater center={getCoords(selectedEvent!)} />
        )}

        {/* Vertical constraint */}
        <VerticalConstraint />

      </MapContainer>

      {selectedEvent && (
        <EventWindow
          isOpen={!!selectedEvent}
          onClose={() => onEventSelect(undefined)}
          event={selectedEvent}
        />
      )}
    </Box>
  );
};
