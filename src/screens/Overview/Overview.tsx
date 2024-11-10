import React, {useState} from 'react';
import {Alert, StyleSheet, useColorScheme} from 'react-native';
import {Region} from 'react-native-maps';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useAppDispatch, useAppSelector} from '../../hooks/hooks';
import {useGeolocation} from '../../hooks/useGeolocation';
import {useLocationModal} from '../../hooks/useLocationModal';
import {
  selectLocations,
  selectCurrentLocation,
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
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const currentColors = isDarkMode ? Colors.dark : Colors.light;

  const {getCurrentPosition} = useGeolocation(dispatch);
  const {
    modalVisible,
    openModal,
    closeModal,
    handleModalSubmit,
    uniqueLocations,
    isEdit,
    clearAllLocations,
  } = useLocationModal(locations, currentLocation);

  const handleMapPress = (e: any) => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    openModal({latitude, longitude});
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
    latitude: currentLocation?.latitude || 37.78825,
    longitude: currentLocation?.longitude || -122.4324,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <MapHandler
        locations={locations}
        position={currentLocation}
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
        currentLocation={currentLocation}
        confirmDeleteLocation={confirmDeleteLocation}
        clearAllLocations={clearAllLocations}
        isSheetExpanded={isSheetExpanded}
        setIsSheetExpanded={setIsSheetExpanded}
      />
      <LocationNameModal
        visible={modalVisible}
        onSubmit={handleModalSubmit}
        onCancel={closeModal}
        backgroundColor={currentColors.background}
        textColor={currentColors.text}
        isEdit={isEdit}
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
