import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface Props {
  center: [number, number] | undefined;
}

export const MapFlyer: React.FC<Props> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);

  return null;
};
