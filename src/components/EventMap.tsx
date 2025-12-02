import { useEffect, useMemo, useRef } from 'react';
import Map, { Marker, Source, Layer, NavigationControl, type MapRef } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import type { V1Event, V1Relation } from '@omnsight/clients/dist/geovision/geovision.js';
import type { FeatureCollection, LineString, GeoJsonProperties } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';

const DARK_STYLE = "https://demotiles.maplibre.org/style.json";
const LIGHT_STYLE = "https://demotiles.maplibre.org/style.json";

interface EventMapProps {
  events: V1Event[];
  relations: V1Relation[];
  theme: 'light' | 'dark';
  selectEvent: (event: V1Event) => void;
}

export const EventMap = ({ events, relations, theme, selectEvent }: EventMapProps) => {
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        map.remove();
      }
    };
  }, []);

  const linesGeoJson = useMemo((): FeatureCollection<LineString, GeoJsonProperties> => {
    return {
      type: 'FeatureCollection',
      features: relations.map(r => {
        const from = events.find(e => e.id === r.from);
        const to = events.find(e => e.id === r.to);
        if (!from?.location || !to?.location) return null;

        return {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [from.location.longitude, from.location.latitude],
              [to.location.longitude, to.location.latitude]
            ]
          },
          properties: {
            name: r.name || '',
            confidence: r.confidence || 0,
          }
        } as GeoJSON.Feature<LineString, GeoJsonProperties>;
      }).filter((feature): feature is NonNullable<typeof feature> => Boolean(feature))
    };
  }, [events, relations]);

  return (
    <Map
      ref={mapRef}
      reuseMaps={true}
      mapLib={maplibregl}
      initialViewState={{
        longitude: -100,
        latitude: 40,
        zoom: 3.5
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle={theme === 'dark' ? DARK_STYLE : LIGHT_STYLE}
      attributionControl={false} // Optional: cleaner look
    >
      <NavigationControl position="top-right" />

      <Source id="relations" type="geojson" data={linesGeoJson}>
        <Layer
          id="relation-lines"
          type="line"
          layout={{
            'line-join': 'round',
            'line-cap': 'round'
          }}
          paint={{
            'line-color': '#4ade80',
            'line-width': 2,
            'line-opacity': 0.6
          }}
        />
      </Source>

      {events.map(event => (
        event.location?.longitude && (
          <Marker
            key={event.id}
            longitude={event.location.longitude}
            latitude={event.location.latitude!} // '!' asserts non-null based on check above
            anchor="bottom"
            style={{ cursor: 'pointer' }} // CSS Cursor for UX
            onClick={(e) => {
              // Important: react-map-gl Marker passes a custom event object
              // We need to stop it from triggering the Map's onClick
              e.originalEvent.stopPropagation();
              selectEvent(event);
            }}
          >
            <div className="text-red-500 hover:scale-125 transition-transform duration-200 ease-out">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="4" fill="white" fillOpacity="0.5" />
              </svg>
            </div>
          </Marker>
        )
      ))}
    </Map>
  );
};