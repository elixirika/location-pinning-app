import {useState, useCallback, useMemo} from 'react';
import {Alert} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import {
  fetchAddress,
  addLocation,
  updateLocation,
  clearLocations,
} from '../redux/slices/locationsSlice';
import {Coordinates, Location} from '../types/types';
import {useAppDispatch} from './hooks';


// util to check if location already exists
const isLocationDuplicate = (
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

// util to exclude current loc from the saved locs
const filterUniqueLocations = (
  locations: Location[],
  currentLocation: Location | null,
): Location[] => {
  return locations.filter(
    (location, index, self) =>
      index === self.findIndex(loc => loc.address === location.address) &&
      !(
        currentLocation &&
        location.latitude === currentLocation.latitude &&
        location.longitude === currentLocation.longitude
      ),
  );
};

export const useLocationModal = (
  locations: Location[],
  currentLocation: Location | null,
) => {
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newLocationCoords, setNewLocationCoords] =
    useState<Coordinates | null>(null);

  const uniqueLocations = useMemo(
    () => filterUniqueLocations(locations, currentLocation),
    [locations, currentLocation],
  );

  const openModal = useCallback(
    (coords: Coordinates, location?: Location) => {
      const {latitude, longitude} = coords;

      if (
        !isLocationDuplicate(latitude, longitude, locations, currentLocation)
      ) {
        setNewLocationCoords(coords);
        setModalVisible(true);
        setIsEdit(false);
      } else {
        setModalVisible(true);
        setIsEdit(true);
        // existing location to the modal for editing
        setNewLocationCoords({latitude, longitude});
      }
    },
    [locations, currentLocation],
  );

  const closeModal = () => {
    setModalVisible(false);
    setNewLocationCoords(null);
  };

  const handleModalSubmit = async (locationName: string, id?: string) => {
    if (newLocationCoords) {
      const {latitude, longitude} = newLocationCoords;

      const locationExists = isLocationDuplicate(
        latitude,
        longitude,
        uniqueLocations,
        currentLocation,
      );

      // just a nice to have checker ~~
      if (locationExists && !isEdit) {
        Alert.alert(
          'Location already exists',
          'This location is already on the map.',
        );
        return;
      }

      const resultAction = await dispatch(
        fetchAddress({latitude, longitude, name: locationName, id}),
      );

      if (fetchAddress.fulfilled.match(resultAction)) {
        const {latitude, longitude, address} = resultAction.payload;

        const newLocation = {
          id: id || uuidv4(),
          latitude,
          longitude,
          address,
          name: locationName,
        };

        if (isEdit) {
          dispatch(updateLocation(newLocation));
        } else {
          dispatch(addLocation(newLocation));
        }
      } else {
        Alert.alert(
          'Error',
          `Could not fetch address. Error: ${resultAction.error.message}`,
        );
      }

      closeModal();
    }
  };

  const clearAllLocations = () => {
    dispatch(clearLocations());
  };

  return {
    modalVisible,
    openModal,
    closeModal,
    handleModalSubmit,
    uniqueLocations,
    isEdit,
    clearAllLocations,
  };
};
