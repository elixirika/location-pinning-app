import React, {useRef, useState, useEffect} from 'react';
import {
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker, Region} from 'react-native-maps';
import ThemedScreen from '../components/ThemedScreen';
import {Colors} from '../utils/colors';

const Overview: React.FC = () => {
  const mapRef = useRef<MapView | null>(null);
  const [position, setPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const isDarkMode = useColorScheme() === 'dark';
  const currentColors = isDarkMode ? Colors.dark : Colors.light;

  // Get the current position of the device
  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      pos => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      error => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
      {enableHighAccuracy: true},
    );
  };

  // Set the initial or default region if position isn't yet available
  const getInitialRegion = (): Region => {
    if (position) {
      return {
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.005, // Smaller delta for closer zoom
        longitudeDelta: 0.005,
      };
    }
    return {
      latitude: 37.78825, // Default if no location is available
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  };

  // Center map to the current location when the position updates
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

  // Handle map tap to place a marker
  const handleMapPress = (e: any) => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    setSelectedLocation({latitude, longitude});
  };

  useEffect(() => {
    // Get the initial location when the component is mounted
    getCurrentPosition();
  }, []);

  return (
    <ThemedScreen>
      <View style={styles.container}>
        <Text style={{color: currentColors.text}}>
          <Text>Current position: </Text>
          {position
            ? `${position.latitude}, ${position.longitude}`
            : 'Fetching...'}
        </Text>
        <Button title="Get Current Position" onPress={getCurrentPosition} />

        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={getInitialRegion()}
          onPress={handleMapPress}>

          {/* Display a marker at the current location */}
          {position && (
            <Marker
              coordinate={position}
              title="Current Location"
              description="You are here"
              pinColor="blue"
            />
          )}

          {/* Display a marker at the selected location */}
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              title="Selected Location"
              description="This is the location you tapped"
            />
          )}
        </MapView>
      </View>
    </ThemedScreen>
  );
};

export default Overview;

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: height,
    width: width,
  },
});
