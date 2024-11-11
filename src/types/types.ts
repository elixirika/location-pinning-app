import {TextStyle, ViewStyle} from 'react-native';
import {Region} from 'react-native-maps';

export interface Coordinates {
  latitude: number;
  longitude: number;
  address?: string | null | undefined;
}

export interface LocationBase {
  id: string;
  latitude: number;
  longitude: number;
  address: string | null;
}

export interface Location extends LocationBase {
  name?: string;
}

export interface Styles {
  backgroundStyle?: ViewStyle;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export interface ColorScheme {
  backgroundColor?: string;
  textColor?: string;
}

export interface CurrentLocationProps extends ColorScheme {
  getCurrentPosition: () => void;
  address: string | null | undefined;
}

export interface MapHandlerProps {
  locations: Location[];
  position: Coordinates | null;
  handleMapPress: (e: any) => void;
  handlePinLongPress?: (e: any) => void;
  confirmDeleteLocation: (id: string, name?: string) => void;
  getInitialRegion: () => Region;
  address: string | null | undefined;
  handleMarkerDragEnd: (locationId: string, e: any) => void;
  distances: {[id: string]: number};
  selectedCoordinates: Coordinates | null;
}

export interface BottomSheetProps extends Styles {
  currentAddress: string | null | undefined;
  locations: Location[];
  currentLocation: Coordinates | null;
  confirmDeleteLocation: (id: string, name?: string) => void;
  clearAllLocations: () => void;
  isSheetExpanded: boolean;
  setIsSheetExpanded: (value: boolean) => void;
  distances: {[id: string]: number};
  bottomSheetRef: any;
  minimizeSheet: () => void;
}

export interface LocationNameModalProps extends ColorScheme {
  visible: boolean;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  isEdit?: boolean;
  locationName?: string;
}

export interface SearchFieldProps {
  onPlaceSelect: (latitude: number, longitude: number, address: string) => void;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
  currentColors: ColorScheme;
  minimizeSheet: () => void;
}
