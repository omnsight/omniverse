import React, { useState, useEffect, useRef } from 'react';
import { useMapEvents, CircleMarker, Polyline, Tooltip, Marker } from 'react-leaflet';
import { Paper, ActionIcon, Stack, Text, Tooltip as MantineTooltip } from '@mantine/core';
import { CursorArrowRaysIcon, MapIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';

// --- TYPES ---
export interface RulerPoint {
  lat: number;
  lng: number;
  distanceFromStart: number; // in meters
}

export type ToolMode = 'normal' | 'ruler';

interface MapToolsProps {
  mode: ToolMode;
  onChangeMode: (mode: ToolMode) => void;
}

// --- HELPERS ---
const formatDistance = (meters: number) => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
};

// Custom DivIcon for the close button on the last point
const CloseIcon = L.divIcon({
  className: 'custom-close-icon',
  html: `<div style="background-color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border: 1px solid red; cursor: pointer;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" style="width: 12px; height: 12px;">
      <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
    </svg>
  </div>`,
  iconSize: [16, 16],
  iconAnchor: [-8, 8], // Offset to appear next to the point
});

// Wrapper to stop event propagation (prevents map clicks when interacting with UI)
const MapControl: React.FC<{ children: React.ReactNode; style: React.CSSProperties }> = ({ children, style }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      L.DomEvent.disableClickPropagation(ref.current);
      L.DomEvent.disableScrollPropagation(ref.current);
    }
  }, []);

  return (
    <div ref={ref} style={{ position: 'absolute', zIndex: 1000, ...style }}>
      {children}
    </div>
  );
};

// --- COMPONENT ---
export const MapTools: React.FC<MapToolsProps> = ({ mode, onChangeMode }) => {
  const { t } = useTranslation();
  const [rulerPoints, setRulerPoints] = useState<RulerPoint[]>([]);
  const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number } | null>(null);

  // Clear ruler when switching modes
  useEffect(() => {
    if (mode === 'normal') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRulerPoints([]);
      setCursorPos(null);
    }
  }, [mode]);

  // Remove last point helper
  const removeLastPoint = () => {
    setRulerPoints(prev => prev.slice(0, -1));
  };

  // Map Events Hook
  useMapEvents({
    click(e) {
      if (mode === 'ruler') {
        const { lat, lng } = e.latlng;
        let dist = 0;
        if (rulerPoints.length > 0) {
          const lastPoint = rulerPoints[rulerPoints.length - 1];
          const from = L.latLng(lastPoint.lat, lastPoint.lng);
          const to = L.latLng(lat, lng);
          dist = lastPoint.distanceFromStart + from.distanceTo(to);
        }
        setRulerPoints(prev => [...prev, { lat, lng, distanceFromStart: dist }]);
      }
    },
    mousemove(e) {
      if (mode === 'ruler') {
        setCursorPos({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
    contextmenu() {
      if (mode === 'ruler' && rulerPoints.length > 0) {
        removeLastPoint();
      }
    }
  });

  const resetRuler = () => {
    setRulerPoints([]);
  };

  return (
    <>
      {/* 1. VISUALIZATION LAYERS (Inside Map) */}
      {rulerPoints.map((point, idx) => (
        <React.Fragment key={`ruler-pt-${idx}`}>
          <CircleMarker
            center={[point.lat, point.lng]}
            radius={4}
            pathOptions={{ color: 'red', fillColor: 'white', fillOpacity: 1 }}
          >
            <Tooltip permanent direction="top" offset={[0, -5]}>
              {idx === 0 ? t('map.start') : formatDistance(point.distanceFromStart)}
            </Tooltip>
          </CircleMarker>
          
          {/* Connector to previous point */}
          {idx > 0 && (
            <Polyline
              positions={[
                [rulerPoints[idx - 1].lat, rulerPoints[idx - 1].lng],
                [point.lat, point.lng]
              ]}
              color="red"
              dashArray="5, 10"
              weight={2}
            />
          )}

          {/* Close button on the last point */}
          {idx === rulerPoints.length - 1 && (
            <Marker
              position={[point.lat, point.lng]}
              icon={CloseIcon}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e); // Prevent map click
                  removeLastPoint();
                }
              }}
            />
          )}
        </React.Fragment>
      ))}

      {/* Live Preview Line (from last point to cursor) */}
      {mode === 'ruler' && rulerPoints.length > 0 && cursorPos && (
        <Polyline
          positions={[
            [rulerPoints[rulerPoints.length - 1].lat, rulerPoints[rulerPoints.length - 1].lng],
            [cursorPos.lat, cursorPos.lng]
          ]}
          color="red"
          dashArray="5, 10"
          weight={1}
          opacity={0.6}
        />
      )}

      {/* 2. UI OVERLAYS (Bottom Left Tools - Vertical & Smaller) */}
      <MapControl style={{ bottom: 20, left: 20 }}>
        <Paper shadow="md" p={4} radius="md">
          <Stack gap={4}>
            <MantineTooltip label={t('map.normalMode')} withArrow position="right">
              <ActionIcon
                variant={mode === 'normal' ? 'filled' : 'subtle'}
                color="blue"
                size="md"
                onClick={() => onChangeMode('normal')}
              >
                <CursorArrowRaysIcon style={{ width: '70%', height: '70%' }} />
              </ActionIcon>
            </MantineTooltip>
            <MantineTooltip label={t('map.rulerMode')} withArrow position="right">
              <ActionIcon
                variant={mode === 'ruler' ? 'filled' : 'subtle'}
                color={mode === 'ruler' ? 'red' : 'gray'}
                size="md"
                onClick={() => onChangeMode('ruler')}
              >
                <MapIcon style={{ width: '70%', height: '70%' }} />
              </ActionIcon>
            </MantineTooltip>
          </Stack>
        </Paper>
      </MapControl>

      {/* 3. INFO PANEL (Upper Left) */}
      {mode === 'ruler' && (
        <MapControl style={{ top: 20, left: 60 }}>
          <Paper shadow="md" p="xs" style={{ minWidth: 200 }}>
            <Stack gap={2}>
              <Text size="xs" fw={700} c="dimmed">{t('map.rulerMode')}</Text>
              {cursorPos ? (
                <>
                  <Text size="sm">{t('event.latitude')}: {cursorPos.lat.toFixed(6)}</Text>
                  <Text size="sm">{t('event.longitude')}: {cursorPos.lng.toFixed(6)}</Text>
                </>
              ) : (
                <Text size="sm" fs="italic">{t('map.moveCursor')}</Text>
              )}
              {rulerPoints.length > 0 && (
                <>
                  <Text size="xs" mt="xs" fw={700} c="dimmed">{t('map.totalDistance')}</Text>
                  <Text size="sm">{formatDistance(rulerPoints[rulerPoints.length - 1].distanceFromStart)}</Text>
                  <Text size="xs" c="dimmed" style={{ cursor: 'pointer' }} onClick={resetRuler}>
                    {t('map.clickToReset')}
                  </Text>
                </>
              )}
            </Stack>
          </Paper>
        </MapControl>
      )}
    </>
  );
};
