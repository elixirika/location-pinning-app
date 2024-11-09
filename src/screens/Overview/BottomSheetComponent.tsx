import React, {useRef} from 'react';
import {StyleSheet, Text} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {Colors} from '../../utils/colors';

const BottomSheetComponent: React.FC<{currentAddress: string | null}> = ({
  currentAddress,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={['5%']} // Included bottom snap point only ince enableDynamicSizing is true
      handleIndicatorStyle={styles.handleIndicator}>
      <BottomSheetView style={styles.bottomSheetContent}>
        <Text style={styles.sheetTitle}>Location Details</Text>
        <Text>Current Address: {currentAddress || 'Fetching address...'}</Text>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BottomSheetComponent;

const styles = StyleSheet.create({
  bottomSheetContent: {
    padding: 20,
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
