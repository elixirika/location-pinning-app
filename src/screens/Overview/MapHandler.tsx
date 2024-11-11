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
  handlePinLongPress,
  confirmDeleteLocation,
  getInitialRegion,
  address,
  handleMarkerDragEnd,
  distances,
  selectedCoordinates,
}) => {
  const mapRef = useRef<MapView | null>(null);

  // Update region when current position changes
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

  // uppdate region when selectedCoordinates change (for zooming)
  useEffect(() => {
    if (selectedCoordinates && mapRef.current) {
      const {latitude, longitude} = selectedCoordinates;
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000,
      );
    }
  }, [selectedCoordinates]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      region={getInitialRegion()}
      onPress={handleMapPress}
      onLongPress={handlePinLongPress}
      showsCompass={false}>
      {position && (
        <Marker
          coordinate={position}
          title="Current Location"
          description={address || 'Fetching address...'}>
          <CustomSvg
            path="M480-366.67q52.93 0 95.47-25.16Q618-417 643.33-458.67q-34.33-27-75.81-40.83-41.47-13.83-87.66-13.83t-87.53 13.83q-41.33 13.83-75.66 40.83Q342-417 384.53-391.83q42.54 25.16 95.47 25.16Zm.06-200q30.27 0 51.77-21.56 21.5-21.55 21.5-51.83 0-30.27-21.56-51.77-21.55-21.5-51.83-21.5-30.27 0-51.77 21.56-21.5 21.55-21.5 51.83 0 30.27 21.56 51.77 21.55 21.5 51.83 21.5ZM480-80Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z"
            width="50"
            height="50"
            fill={Colors.cyan}
          />
        </Marker>
      )}

      {locations.map(location => (
        <Marker
          key={location.id}
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={`Saved Location: ${location.name}`}
          description={`~${distances[location.id]?.toFixed(
            2,
          )} km away from your current location`}
          onCalloutPress={() =>
            confirmDeleteLocation(location.id, location.name)
          }
          draggable
          onDragEnd={e => handleMarkerDragEnd(location.id, e)}>
          <CustomSvg
            path="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-180q45-45 80-93 30-41 55-90t25-97q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 48 25 97t55 90q35 48 80 93Zm0-220q-25 0-42.5-17.5T420-540q0-25 17.5-42.5T480-600q25 0 42.5 17.5T540-540q0 25-17.5 42.5T480-480Z"
            width="50"
            height="50"
            fill={Colors.lime}
          />
        </Marker>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
