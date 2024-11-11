import React, {useState} from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_MAPS_API_KEY} from '@env';
import {Colors} from '../../utils/colors';
import {SearchFieldProps} from '../../types/types';

const SearchField: React.FC<SearchFieldProps> = ({
  currentColors,
  onPlaceSelect,
  isSearching,
  setIsSearching,
  minimizeSheet,
}) => {
  const handleOnFocus = () => {
    setIsSearching(true);
    minimizeSheet();
  };
  return (
    <GooglePlacesAutocomplete
      placeholder="Search for a place"
      enablePoweredByContainer={false}
      onPress={(data, details) => {
        setIsSearching(false);
        if (details) {
          const {lat, lng} = details.geometry.location;
          const formattedAddress = details.formatted_address;
          onPlaceSelect(lat, lng, formattedAddress);
        }
      }}
      onFail={() => setIsSearching(false)}
      onNotFound={() => setIsSearching(false)}
      textInputProps={{
        onFocus: handleOnFocus,
        onBlur: () => setIsSearching(false),
      }}
      renderRow={data => (
        <View style={styles.row}>
          <Text style={[styles.mainText, {color: currentColors.textColor}]}>
            {data.structured_formatting.main_text}
          </Text>
          <Text
            style={[styles.secondaryText, {color: currentColors.textColor}]}>
            {data.structured_formatting.secondary_text}
          </Text>
        </View>
      )}
      listLoaderComponent={<ActivityIndicator color={Colors.active} />}
      listEmptyComponent={
        <View
          style={[
            styles.emptyContainer,
            {backgroundColor: currentColors.backgroundColor},
          ]}>
          <Text style={[styles.emptyText, {color: currentColors.textColor}]}>
            No results found.
          </Text>
        </View>
      }
      query={{
        key: GOOGLE_MAPS_API_KEY,
        language: 'en',
      }}
      fetchDetails
      styles={{
        container: styles.autocompleteContainer,

        textInput: [
          styles.textInput,
          {
            backgroundColor: currentColors.backgroundColor,
            color: currentColors.textColor,
          },
        ],
        row: {
          backgroundColor: currentColors.backgroundColor,
          display: isSearching ? 'flex' : 'none',
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  autocompleteContainer: {
    position: 'absolute',
    top: 50,
    width: '85%',
    maxHeight: 200,
    zIndex: 1000,
    marginHorizontal: 10,
  },
  textInput: {
    height: 44,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 15,
    flex: 1,
  },
  row: {
    width: '100%',
  },
  mainText: {
    fontSize: 16,
  },
  secondaryText: {
    fontSize: 12,
  },
  emptyContainer: {
    marginBottom: 10,
    borderRadius: 5,
  },
  emptyText: {textAlign: 'center', padding: 10},
});

export default SearchField;
