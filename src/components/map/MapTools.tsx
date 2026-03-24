import React, { useState, useEffect, useRef } from 'react';
import { useMapEvents, CircleMarker, Polyline, Tooltip, Marker } from 'react-leaflet';
import { Paper, ActionIcon, Stack, Text, Tooltip as MantineTooltip } from '@mantine/core';
import { CursorArrowRaysIcon, MapIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import { useMapToolState, useMapToolActions } from './mapToolState';

// --- HELPERS ---
const formatDistance = (meters: number) => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
};

const toDMS = (deg: number, isLat: boolean) => {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);
  const direction = isLat ? (deg >= 0 ? 'N' : 'S') : deg >= 0 ? 'E' : 'W';
  return `${degrees}º ${minutes}' ${seconds}'' ${direction}`;
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

const GhostPointIcon = L.divIcon({
  className: 'ghost-point-icon',
  html: `<div style="
    background-color: rgba(255, 255, 255, 0.6);
    border: 2px dashed rgba(255, 0, 0, 0.6);
    border-radius: 50%;
    width: 12px;
    height: 12px;
    box-sizing: border-box;
  "></div>`,
  iconSize: [12, 12],
  iconAnchor: [18, 18], // Places icon to the top-left of the cursor
});

// Wrapper to stop event propagation (prevents map clicks when interacting with UI)
const MapControl: React.FC<{ children: React.ReactNode; style: React.CSSProperties }> = ({
  children,
  style,
}) => {
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
export const MapTools: React.FC = () => {
  const { t } = useTranslation();
  const mode = useMapToolState((state) => state.mode);
  const rulerPoints = useMapToolState((state) => state.rulerPoints);
  const { setMode, addRulerPoint, removeLastRulerPoint, clearRulerPoints } = useMapToolActions();
  const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number } | null>(null);

  // Clear ruler when switching modes
  useEffect(() => {
    if (mode === 'normal') {
      clearRulerPoints();
    }
  }, [mode, clearRulerPoints]);

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
        addRulerPoint({ lat, lng, distanceFromStart: dist });
      }
    },
    mousemove(e) {
      setCursorPos({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    contextmenu() {
      if (mode === 'ruler' && rulerPoints.length > 0) {
        removeLastRulerPoint();
      }
    },
  });

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
              <div style={{ textAlign: 'center' }}>
                <div>
                  {idx === 0
                    ? t('components.map.MapTools.start', '?')
                    : formatDistance(point.distanceFromStart)}
                </div>
                <div style={{ fontSize: '0.8em', color: '#666' }}>
                  {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
                </div>
              </div>
            </Tooltip>
          </CircleMarker>

          {/* Connector to previous point */}
          {idx > 0 && (
            <Polyline
              positions={[
                [rulerPoints[idx - 1].lat, rulerPoints[idx - 1].lng],
                [point.lat, point.lng],
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
                  removeLastRulerPoint();
                },
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
            [cursorPos.lat, cursorPos.lng],
          ]}
          color="red"
          dashArray="5, 10"
          weight={1}
          opacity={0.6}
        />
      )}

      {/* Ghost Point (following cursor in ruler mode) */}
      {mode === 'ruler' && cursorPos && (
        <Marker
          position={[cursorPos.lat, cursorPos.lng]}
          icon={GhostPointIcon}
          interactive={false}
        />
      )}

      {/* 2. UI OVERLAYS (Bottom Left Tools - Vertical & Smaller) */}
      <MapControl style={{ bottom: 20, left: 20 }}>
        <Paper shadow="md" p={4} radius="md">
          <Stack gap={4}>
            <MantineTooltip label={t('components.map.MapTools.normalMode', '?')} withArrow position="right">
              <ActionIcon
                variant={mode === 'normal' ? 'filled' : 'subtle'}
                color="blue"
                size="md"
                onClick={() => setMode('normal')}
              >
                <CursorArrowRaysIcon style={{ width: '70%', height: '70%' }} />
              </ActionIcon>
            </MantineTooltip>
            <MantineTooltip label={t('components.map.MapTools.rulerMode', '?')} withArrow position="right">
              <ActionIcon
                variant={mode === 'ruler' ? 'filled' : 'subtle'}
                color={mode === 'ruler' ? 'red' : 'gray'}
                size="md"
                onClick={() => {
                  if (mode === 'ruler') {
                    clearRulerPoints();
                  }
                  setMode('ruler');
                }}
              >
                <MapIcon style={{ width: '70%', height: '70%' }} />
              </ActionIcon>
            </MantineTooltip>
          </Stack>
        </Paper>
      </MapControl>

      {/* 3. Lat/Lon Display (Bottom Center) */}
      <MapControl style={{ bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>
        <Paper
          shadow="md"
          p={6}
          radius="md"
          bg="rgba(50, 50, 50, 0.8)"
          style={{ backdropFilter: 'blur(2px)' }}
        >
          <Text
            size="xs"
            fw={700}
            c="white"
            style={{ whiteSpace: 'nowrap', fontFamily: 'monospace' }}
          >
            {cursorPos
              ? `${toDMS(cursorPos.lat, true)}   ${toDMS(cursorPos.lng, false)}`
              : "--º --' --. --'' N   --º --' --. --'' E"}
          </Text>
        </Paper>
      </MapControl>
    </>
  );
};
