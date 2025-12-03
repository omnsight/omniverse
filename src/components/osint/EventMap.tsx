import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '../../utilties/useAppStore';
import { EventWindow } from './EventWindow';
import type { V1Event } from '@omnsight/clients/dist/geovision/geovision.js';
import { Box, useMantineColorScheme } from '@mantine/core';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

interface EventMapProps {
  selectedEvent?: V1Event | null;
  onEventSelect?: (event: V1Event | null) => void;
}

export const EventMap: React.FC<EventMapProps> = ({ selectedEvent: controlledSelectedEvent, onEventSelect }) => {
  const { events, relations } = useAppStore();
  const { colorScheme } = useMantineColorScheme();
  const [internalSelectedEvent, setInternalSelectedEvent] = useState<V1Event | null>(null);

  // Determine which state to use (controlled or uncontrolled)
  const isControlled = controlledSelectedEvent !== undefined;
  const selectedEvent = isControlled ? controlledSelectedEvent : internalSelectedEvent;

  const setSelectedEvent = (event: V1Event | null) => {
    if (!isControlled) {
      setInternalSelectedEvent(event);
    }
    onEventSelect?.(event);
  };

  // Helper to get coordinates safely
  const getCoords = (e: V1Event): [number, number] | null => {
    const loc = e.location as any;
    if (loc && typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
      return [loc.latitude, loc.longitude];
    }
    return null;
  };

  const handleEventClick = (event: V1Event) => {
    setSelectedEvent(event);
  };

  return (
    <Box style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
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

        {/* Events */}
        {events.map((event) => {
          const coords = getCoords(event);
          if (!coords) return null;
          const key = event.key || Math.random().toString();
          return (
            <Marker
              key={key}
              position={coords}
              icon={DefaultIcon}
              eventHandlers={{
                click: () => handleEventClick(event)
              }}
            />
          );
        })}

        {/* Relations */}
        {relations.map((rel, idx) => {
          const r = rel as any;
          const sourceKey = r.source || r.from;
          const targetKey = r.target || r.to;

          const sourceEvent = events.find(e => e.key === sourceKey);
          const targetEvent = events.find(e => e.key === targetKey);

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

      </MapContainer>

      {selectedEvent && (
        <EventWindow
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
        />
      )}
    </Box>
  );
};
