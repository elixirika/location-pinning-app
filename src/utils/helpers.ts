import { getDistance } from 'geolib';
import { Coordinates, Location } from '../types/types';

export const calculateDistancesFromPosition = (
  position: Coordinates | null,
  locations: Location[]
): { [key: string]: number } => {
  if (!position) return {};

  const distances: { [key: string]: number } = {};
  locations.forEach(location => {
    const distance = getDistance(position, {
      latitude: location.latitude,
      longitude: location.longitude,
    });
    distances[location.id] = distance / 1000; // convert to km
  });
  return distances;
};