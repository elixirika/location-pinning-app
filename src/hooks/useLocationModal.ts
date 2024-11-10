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
import {
  filterUniqueLocations,
  isCurrentLocation,
  isLocationDuplicate,
} from '../utils/helpers';
import {useAppDispatch} from './hooks';

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

      if (isCurrentLocation(latitude, longitude, currentLocation)) {
        return;
      }

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

  const handleModalSubmit = async (
    locationName: string,
    id?: string,
  ): Promise<void> => {
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
