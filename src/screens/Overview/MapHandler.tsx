import React, {useRef, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {StyleSheet} from 'react-native';
import CustomSvg from '../../components/CustomSvg';
import {MapHandlerProps} from '../../types/types';
import {Colors} from '../../utils/colors';

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
        >
          <CustomSvg
            path="M480-360q56 0 101-27.5t71-72.5q-35-29-79-44.5T480-520q-49 0-93 15.5T308-460q26 45 71 72.5T480-360Zm0-200q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0 374q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"
            width="50"
            height="50"
            fill="cyan"
          />
        </Marker>
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
