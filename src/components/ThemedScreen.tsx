import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type ThemedScreenProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const ThemedScreen: React.FC<ThemedScreenProps> = ({ children, style }) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const textStyle = {
    color: isDarkMode ? Colors.white : Colors.black,
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle, style]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={[styles.contentContainer, backgroundStyle]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  text: {
    fontSize: 18,
  },
});

export default ThemedScreen;
