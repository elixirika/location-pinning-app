import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {AddressDisplayProps} from '../../types/types';

export const AddressDisplay: React.FC<AddressDisplayProps> = ({
  address,
  getCurrentPosition,
  currentColors,
}) => (
  <View
    style={[
      styles.addressContainer,
      {backgroundColor: currentColors.background},
    ]}>
    <Button title="Get Current Position" onPress={getCurrentPosition} />
    <Text style={{color: currentColors.text}}>
      Current position: {address || 'Fetching...'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  addressContainer: {
    padding: 10,
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    borderRadius: 10,
  },
});
