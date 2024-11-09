import React from 'react';
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
import { CurrentLocationButton } from './CurrentLocationButton';

const Overview: React.FC = () => {
  const dispatch = useAppDispatch();
  const locations = useAppSelector(selectLocations) as Location[];
  const currentLocation = useAppSelector(
    selectCurrentLocation,
  ) as Location | null;
  const isDarkMode = useColorScheme() === 'dark';
  const currentColors = isDarkMode ? Colors.dark : Colors.light;

  const {position, getCurrentPosition} = useGeolocation(dispatch);

  const handleMapPress = async (e: any) => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    const resultAction = await dispatch(fetchAddress({latitude, longitude}));
    if (fetchAddress.fulfilled.match(resultAction)) {
      dispatch(
        addLocation({
          id: uuidv4(),
          latitude,
          longitude,
          address: resultAction.payload.address,
        }),
      );
    } else {
      Alert.alert('Error', 'Could not fetch address');
    }
  };

  const confirmDeleteLocation = (id: string) => {
    Alert.alert(
      'Delete Location',
      `Are you sure you want to delete this location?\n${id}`,
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

  return (
      <GestureHandlerRootView style={{flex: 1}}>
        <MapHandler
          locations={locations}
          position={position}
          handleMapPress={handleMapPress}
          confirmDeleteLocation={confirmDeleteLocation}
          getInitialRegion={getInitialRegion}
          address={currentLocation?.address}
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
          locations={locations}
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
