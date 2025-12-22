import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const MapConstraint = () => {
  const map = useMap();

  useEffect(() => {
    // 1. Define your limits (approx 85 deg is the map edge)
    const MAX_LAT = 85;
    const MIN_LAT = -85;

    const handleDrag = () => {
      const center = map.getCenter();
      let newLat = center.lat;

      // 2. Clamp latitude if it exceeds limits
      if (center.lat > MAX_LAT) newLat = MAX_LAT;
      if (center.lat < MIN_LAT) newLat = MIN_LAT;

      // 3. Reset view ONLY if latitude changed (preserves infinite Longitude)
      if (newLat !== center.lat) {
        // We set animate: false to make the "wall" feel solid
        map.panTo([newLat, center.lng], { animate: false });
      }
    };

    // Attach the event listener
    map.on('drag', handleDrag);

    // Cleanup listener on unmount
    return () => {
      map.off('drag', handleDrag);
    };
  }, [map]);

  return null;
};
