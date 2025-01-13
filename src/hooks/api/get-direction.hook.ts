import { useState } from 'react';
import axios from 'axios';
import { useUserStore } from '@/zustand/user/user.store';
import { MAPBOX_ACCESS_TOKEN, MAPBOX_DIRECTIONS_API_URL } from '../../../config';

export const useGetDirection = () => {
  const [directions, setDirections] = useState<{ latitude: number; longitude: number }[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();
  const location = user?.location;

  const getDirections = async (destination: { longitude: number; latitude: number }) => {
    const origin = `${location?.longitude},${location?.latitude}`;
    const dest = `${destination.longitude},${destination.latitude}`;

    try {
      const response = await axios.get(
        `${MAPBOX_DIRECTIONS_API_URL}/${origin};${dest}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`,
      );

      const coordinates = response.data.routes[0].geometry.coordinates;
      const route = coordinates.map(([longitude, latitude]: [number, number]) => ({ latitude, longitude }));
      setDirections(route);
      setError(null);
    } catch (err) {
      console.error('Error obteniendo la ruta:', err);
      setError('Error obteniendo la ruta');
    }
  };

  return { directions, error, getDirections };
};
