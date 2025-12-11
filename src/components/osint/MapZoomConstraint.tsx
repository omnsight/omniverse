import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const getMinZoomForScreen = () => {
  // Rough calculation: 
  // Height of world at Zoom 0 is ~256px
  // Height of world at Zoom 1 is ~512px
  const screenHeight = window.innerHeight;

  if (screenHeight > 1000) return 3; // Large Desktop
  if (screenHeight > 500) return 2;  // Laptop/Tablet
  return 1;                          // Mobile
};

export const VerticalConstraint = () => {
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