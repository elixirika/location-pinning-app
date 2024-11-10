import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {AddressDisplayProps} from '../../types/types';
import CustomSvg from '../../components/CustomSvg';
import { Colors } from '../../utils/colors';

export const CurrentLocationButton: React.FC<AddressDisplayProps> = ({
  getCurrentPosition,
}) => (
  <View style={[styles.container]}>
    <TouchableOpacity onPress={getCurrentPosition}>
      <CustomSvg
        path="M446.67-42v-76.67q-133-14-223.5-104.5t-104.5-223.5H42v-66.66h76.67q14-133 104.5-223.5t223.5-104.5V-918h66.66v76.67q133 14 223.5 104.5t104.5 223.5H918v66.66h-76.67q-14 133-104.5 223.5t-223.5 104.5V-42h-66.66ZM480-184q122 0 209-87t87-209q0-122-87-209t-209-87q-122 0-209 87t-87 209q0 122 87 209t209 87Zm0-142.67q-64 0-108.67-44.66Q326.67-416 326.67-480t44.66-108.67Q416-633.33 480-633.33t108.67 44.66Q633.33-544 633.33-480t-44.66 108.67Q544-326.67 480-326.67ZZ"
        width="30"
        height="30" fill={Colors.cyan}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    position: 'absolute',
    top: 50,
    right: 10,
    elevation: 4,
  },
});
