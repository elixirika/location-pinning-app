import React, {useState} from 'react';
import {Alert, StyleSheet, useColorScheme} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import {Region} from 'react-native-maps';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useAppDispatch, useAppSelector} from '../../hooks/hooks';
import {useGeolocation} from '../../hooks/useGeolocation';
import {
  selectLocations,
  selectCurrentLocation,
  fetchAddress,
  addLocation,
  deleteLocation,
} from '../../redux/slices/locationsSlice';
import {Location} from '../../types/types';
import {Colors} from '../../utils/colors';
import {MapHandler} from './MapHandler';
import BottomSheetComponent from './BottomSheetComponent';
import {CurrentLocationButton} from './CurrentLocationButton';
import LocationNameModal from './LocationNameModal';

const Overview: React.FC = () => {
  const dispatch = useAppDispatch();
  const locations = useAppSelector(selectLocations) as Location[];
  const currentLocation = useAppSelector(
    selectCurrentLocation,
  ) as Location | null;
  const isDarkMode = useColorScheme() === 'dark';
  const currentColors = isDarkMode ? Colors.dark : Colors.light;

  const {position, getCurrentPosition} = useGeolocation(dispatch);

  const [modalVisible, setModalVisible] = useState(false);
  const [newLocationCoords, setNewLocationCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Open modal and store coordinates on map press
  const handleMapPress = (e: any) => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    setNewLocationCoords({latitude, longitude});
    setModalVisible(true);
  };

  const handleModalSubmit = async (locationName: string) => {
    if (newLocationCoords) {
      const {latitude, longitude} = newLocationCoords;
      const resultAction = await dispatch(
        fetchAddress({latitude, longitude, name: locationName}),
      );

      if (fetchAddress.fulfilled.match(resultAction)) {
        dispatch(
          addLocation({
            id: uuidv4(),
            latitude,
            longitude,
            address: resultAction.payload.address,
            name: locationName,
          }),
        );
      } else {
        Alert.alert('Error', 'Could not fetch address');
      }
    }
    setModalVisible(false);
    setNewLocationCoords(null);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setNewLocationCoords(null);
  };

  const confirmDeleteLocation = (id: string, name?: string) => {
    Alert.alert(
      `Delete ${name}`,
      `Are you sure you want to delete this location?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteLocation(id)),
        },
      ],
    );
  };

  const getInitialRegion = (): Region => ({
    latitude: position?.latitude || 37.78825,
    longitude: position?.longitude || -122.4324,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  // Filter locations to show only unique addresses
  const uniqueLocations = locations.filter(
    (location, index, self) =>
      index === self.findIndex(loc => loc.address === location.address),
  );
  const filteredLocations = uniqueLocations.filter(
    location =>
      !(
        position &&
        location.latitude === position.latitude &&
        location.longitude === position.longitude
      ),
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <MapHandler
        locations={filteredLocations}
        position={position}
        handleMapPress={handleMapPress}
        confirmDeleteLocation={confirmDeleteLocation}
        getInitialRegion={getInitialRegion}
        address={currentLocation?.address}
        handlePinLongPress={confirmDeleteLocation}
      />
      <CurrentLocationButton
        address={currentLocation?.address}
        getCurrentPosition={getCurrentPosition}
        currentColors={currentColors}
      />
      <BottomSheetComponent
        currentAddress={currentLocation?.address ?? null}
        backgroundStyle={{backgroundColor: currentColors.background}}
        textStyle={{color: currentColors.text}}
        locations={filteredLocations}
        currentLocation={position}
      />
      <LocationNameModal
        visible={modalVisible}
        onSubmit={handleModalSubmit}
        onCancel={handleModalCancel}
        backgroundColor={currentColors.background}
        textColor={currentColors.text}
      />
    </GestureHandlerRootView>
  );
};

export default Overview;

const styles = StyleSheet.create({
  bottomSheetContent: {
    padding: 20,
    minHeight: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  handleIndicator: {
    backgroundColor: Colors.inactive,
  },
});
