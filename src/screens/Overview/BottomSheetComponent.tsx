import React, {useCallback, useRef} from 'react';
import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {Colors} from '../../utils/colors';
import {Location} from '../../types/types';
import Card from '../../components/Card';

interface BottomSheetProps {
  currentAddress: string | null;
  style?: ViewStyle;
  backgroundStyle?: ViewStyle;
  textStyle?: TextStyle;
  locations: Location[];
}

const BottomSheetComponent: React.FC<BottomSheetProps> = ({
  currentAddress,
  style,
  backgroundStyle,
  textStyle,
  locations,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const renderItem = useCallback(
    ({item}: {item: Location}) => (
      <Card customStyle={backgroundStyle}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.coords}>{item.address}</Text>
      </Card>
    ),
    [],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={['20%', '80%']}
      maxDynamicContentSize={100}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={backgroundStyle}
      bottomInset={0}>
      <BottomSheetView style={[styles.bottomSheetContent, style]}>
        <Text style={[styles.sheetTitle, textStyle]}>Location Details</Text>
        <Text style={[textStyle]}>
          Current Location: {currentAddress || 'Fetching current location...'}
        </Text>
      </BottomSheetView>
      <BottomSheetFlatList
      style={{marginVertical: 15}}
        data={locations}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View  style={{marginBottom: 10}}>
          <Text style={[styles.text, textStyle]}>
            Add a location by tapping on the map
          </Text>
          </View>
        }
        nestedScrollEnabled
      />
    </BottomSheet>
  );
};

export default BottomSheetComponent;

const styles = StyleSheet.create({
  handleIndicator: {
    backgroundColor: Colors.inactive,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'center',
    color: Colors.active,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.active,
  },
  coords: {
    fontSize: 14,
    color: Colors.inactive,
  },
});
