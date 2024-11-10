import {getDistance} from 'geolib';
import {Coordinates, Location} from '../types/types';

export const calculateDistancesFromPosition = (
  position: Coordinates | null,
  locations: Location[],
): {[key: string]: number} => {
  if (!position) return {};

  const distances: {[key: string]: number} = {};
  locations.forEach(location => {
    const distance = getDistance(position, {
      latitude: location.latitude,
      longitude: location.longitude,
    });
    distances[location.id] = distance / 1000; // convert to km
  });
  return distances;
};

// util to check if location already exists
export const isLocationDuplicate = (
  latitude: number,
  longitude: number,
  locations: Location[],
  currentLocation: Location | null,
): boolean => {
  if (currentLocation) {
    return locations.some(
      loc =>
        loc.latitude === latitude &&
        loc.longitude === longitude &&
        loc.id !== currentLocation.id,
    );
  }
  return locations.some(
    loc => loc.latitude === latitude && loc.longitude === longitude,
  );
};

export const isCurrentLocation = (
  latitude: number,
  longitude: number,
  currentLocation?: Location | null,
) =>
  currentLocation &&
  currentLocation.latitude === latitude &&
  currentLocation.longitude === longitude;

// util to exclude current loc from the saved locs
export const filterUniqueLocations = (
  locations: Location[],
  currentLocation: Location | null,
): Location[] => {
  return locations.filter(
    (location, index, self) =>
      index === self.findIndex(loc => loc.address === location.address) &&
      !isCurrentLocation(
        location.latitude,
        location.longitude,
        currentLocation,
      ),
  );
};
