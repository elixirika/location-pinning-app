import {useState, useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {Alert} from 'react-native';
import {AppDispatch} from '../redux/store';
import {fetchAddress} from '../redux/slices/locationsSlice';
import {Coordinates} from '../types/types';

export const useGeolocation = (dispatch: AppDispatch) => {
  const [position, setPosition] = useState<Coordinates | null>(null);

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      async pos => {
        const {latitude, longitude} = pos.coords;
        setPosition({latitude, longitude});
        await dispatch(
          fetchAddress({latitude, longitude, isCurrentLocation: true}),
        );
      },
      error => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
      {enableHighAccuracy: true},
    );
  };

  useEffect(() => {
    getCurrentPosition();
  }, []);

  return {position, getCurrentPosition};
};
