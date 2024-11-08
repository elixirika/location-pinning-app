import React, { useState } from 'react';
import {Text, useColorScheme, View, Button, Alert} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import ThemedScreen from '../components/ThemedScreen';
import {Colors} from '../utils/colors';

const Overview: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const currentColors = isDarkMode ? Colors.dark : Colors.light;

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      (pos) => {
        setPosition(JSON.stringify(pos));
      },
      (error) => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
      { enableHighAccuracy: true }
    );
  };

  const [position, setPosition] = useState<string | null>(null);

  return (
    <ThemedScreen>
      <View>
        <Text
          style={{
            fontSize: 24,
            textAlign: 'center',
            color: currentColors.text,
          }}>
          Main Screen
        </Text>
        <Text style={{color: currentColors.text,}}>
        <Text >Current position: </Text>
        {position}
      </Text>
      <Button title="Get Current Position" onPress={getCurrentPosition} />
      </View>
    </ThemedScreen>
  );
};

export default Overview;
