import React from 'react';
import {Text, useColorScheme, View} from 'react-native';
import ThemedScreen from '../components/ThemedScreen';
import {Colors} from '../utils/colors';

const Overview: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const currentColors = isDarkMode ? Colors.dark : Colors.light;
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
      </View>
    </ThemedScreen>
  );
};

export default Overview;
