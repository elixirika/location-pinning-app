import React, {useCallback, useMemo, useRef} from 'react';
import {Button, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Card from '../../components/Card';
import CustomSvg from '../../components/CustomSvg';
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
  confirmDeleteLocation,
  clearAllLocations,
  isSheetExpanded,
  setIsSheetExpanded,
  distances,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const swipeableRefs = useRef(new Map()).current;

  const handleSheetChange = (index: number) => {
    setIsSheetExpanded(index > 0);
  };

  const handleOutsidePress = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0);
    }
  };

  const renderDistance = (itemId: string) => {
    if (!currentLocation)
      return <Text style={styles.coords}>Calculating distance...</Text>;
    return (
      <Text style={styles.coords}>
        ~{distances[itemId]?.toFixed(2)} km away
      </Text>
    );
  };

  const RightAction = useCallback(
    (
      prog: SharedValue<number>,
      drag: SharedValue<number>,
      {item}: {item: Location},
    ) => {
      const styleAnimation = useAnimatedStyle(() => {
        return {
          transform: [{translateX: drag.value + 30}],
        };
      });

      return (
        <Reanimated.View style={styleAnimation}>
          <View style={styles.rightAction}>
            <CustomSvg
              path="M600-240v-80h160v80H600Zm0-320v-80h280v80H600Zm0 160v-80h240v80H600ZM120-640H80v-80h160v-60h160v60h160v80h-40v360q0 33-23.5 56.5T440-200H200q-33 0-56.5-23.5T120-280v-360Zm80 0v360h240v-360H200Zm0 0v360-360Z"
              fill={Colors.danger}
              width="30"
              height="30"
            />
          </View>
        </Reanimated.View>
      );
    },
    [confirmDeleteLocation],
  );

  const handleConfirmDelete = (
    id: string,
    name: string | undefined,
    swipeableKey: string,
  ) => {
    confirmDeleteLocation(id, name);
    const swipeableInstance = swipeableRefs.get(swipeableKey);
    if (swipeableInstance) {
      swipeableInstance.close();
    }
  };

  const renderItem = useCallback(
    ({item}: {item: Location}) => (
      <ReanimatedSwipeable
        ref={ref => {
          if (ref) swipeableRefs.set(item.id, ref);
          else swipeableRefs.delete(item.id);
        }}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={100}
        // onSwipeableWillOpen={() => console.log('swipeable open')}
        onSwipeableWillOpen={() =>
          handleConfirmDelete(item.id, item.name, item.id)
        }
        renderRightActions={(prog, drag) => RightAction(prog, drag, {item})}>
        <Card customStyle={backgroundStyle}>
          <Text style={styles.locationName}>{item.name}</Text>
          <Text style={styles.coords}>{item.address}</Text>
          {renderDistance(item.id)}
        </Card>
      </ReanimatedSwipeable>
    ),
    [distances, currentLocation, RightAction],
  );

  return (
    <View style={{flex: 1}}>
      {isSheetExpanded && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleOutsidePress}
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        onChange={handleSheetChange}
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

        <View style={styles.listTitleView}>
          <Text style={[styles.listTitle, textStyle]}>Saved Locations</Text>
          <Button
            title="Delete All"
            onPress={clearAllLocations}
            color={Colors.danger}
          />
        </View>
        <BottomSheetFlatList
          style={{marginVertical: 15}}
          data={locations}
          keyExtractor={item => item.id}
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
    </View>
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
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  listTitleView: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  rightAction: {
    justifyContent: 'center',
    flex: 1,
  },
  deleteText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'green',
  },
});
