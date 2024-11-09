import {ViewStyle} from 'react-native';
import {Region} from 'react-native-maps';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  name?: string;
  id: string;
  latitude: number;
  longitude: number;
  address: string | null;
}

export interface AddressDisplayProps {
  address: string | null | undefined;
  getCurrentPosition: () => void;
  currentColors: {
    background: string;
    text: string;
  };
}

export interface MapHandlerProps {
  locations: Location[];
  position: Coordinates | null;
  handleMapPress: (e: any) => void;
  handlePinLongPress?: (e: any) => void;
  confirmDeleteLocation: (id: string, name?: string) => void;
  getInitialRegion: () => Region;
  address?: string | null | undefined;
}
