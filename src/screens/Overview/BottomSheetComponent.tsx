import React, {useCallback, useMemo, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import Card from '../../components/Card';
import {calculateDistancesFromPosition} from '../../utils/helpers';
import {Colors} from '../../utils/colors';
import {BottomSheetProps, Location} from '../../types/types';

const BottomSheetComponent: React.FC<BottomSheetProps> = ({
  currentAddress,
  style,
  backgroundStyle,
  textStyle,
  locations,
  currentLocation,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Only calculate distances if currentLocation exists
  const distances = useMemo(
    () => calculateDistancesFromPosition(currentLocation, locations),
    [currentLocation, locations],
  );

  const renderDistance = (itemId: string) => {
    if (!currentLocation)
      return <Text style={styles.coords}>Calculating distance...</Text>;
    return (
      <Text style={styles.coords}>
        ~{distances[itemId]?.toFixed(2)} km away 
      </Text>
    );
  };

  const renderItem = useCallback(
    ({item}: {item: Location}) => (
      <Card customStyle={backgroundStyle}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.coords}>{item.address}</Text>
        {renderDistance(item.id)}
      </Card>
    ),
    [distances, backgroundStyle, currentLocation],
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
          <View style={{marginBottom: 10}}>
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
