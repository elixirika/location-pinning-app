import React, {useRef, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {StyleSheet} from 'react-native';
import {MapHandlerProps} from '../../types/types';
import { Colors } from '../../utils/colors';

export const MapHandler: React.FC<MapHandlerProps> = ({
  locations,
  position,
  handleMapPress,
  confirmDeleteLocation,
  getInitialRegion,
  address,
}) => {
  const mapRef = useRef<MapView | null>(null);

  // Filter locations to show only unique addresses 
  const uniqueLocations = locations
    .filter(
      (location, index, self) =>
        index === self.findIndex(loc => loc.address === location.address),
    )
    const filteredLocations = uniqueLocations.filter(location =>
      !(position && location.latitude === position.latitude && location.longitude === position.longitude),
    );

  useEffect(() => {
    if (position && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...position,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000,
      );
    }
  }, [position]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      region={getInitialRegion()}
      onPress={handleMapPress}>
      {position && (
        <Marker
          coordinate={position}
          title="Current Location"
          description={address || 'Fetching address...'}
          pinColor="blue"
        />
      )}

      {filteredLocations.map(location => (
        <Marker
          key={location.id}
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Saved Location"
          description={location.address || 'Fetching address...'}
          onPress={() => confirmDeleteLocation(location.id)}
          pinColor={Colors.active}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
