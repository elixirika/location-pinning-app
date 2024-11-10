import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {GOOGLE_MAPS_API_KEY} from '@env';
import {v4 as uuidv4} from 'uuid';

interface Location {
  id?: string;
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
}

interface LocationsState {
  currentLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  } | null;
  locations: Location[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: LocationsState = {
  currentLocation: null,
  locations: [],
  status: 'idle',
};

// async thunk for reverse geocoding
export const fetchAddress = createAsyncThunk(
  'locations/fetchAddress',
  async (
    {
      latitude,
      longitude,
      isCurrentLocation = false,
      name,
      id,
    }: {
      latitude: number;
      longitude: number;
      isCurrentLocation?: boolean;
      name?: string;
      id?: string;
    },
    {rejectWithValue},
  ) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`,
      );
      const data = await response.json();
      const address = data.results[0]?.formatted_address || 'Unknown location';

      return {
        latitude,
        longitude,
        address,
        isCurrentLocation,
        name: name || 'unnamed',
        id: id || uuidv4(),
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch address');
    }
  },
);

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<Location>) => {
      const newLocation = action.payload;

      // checker if the location already exists by matching its coordinates and ID
      const existingLocation = state.locations.find(
        loc =>
          loc.latitude === newLocation.latitude &&
          loc.longitude === newLocation.longitude,
      );
      if (!existingLocation) {
        state.locations.push(newLocation);
      }
    },
    deleteLocation: (state, action: PayloadAction<string>) => {
      state.locations = state.locations.filter(
        location => location.id !== action.payload,
      );
    },

    updateLocation: (state, action: PayloadAction<Location>) => {
      const {id, latitude, longitude} = action.payload;

      const index = state.locations.findIndex(
        loc =>
          loc.id === id ||
          (loc.latitude === latitude && loc.longitude === longitude),
      );

      if (index !== -1) {
        state.locations[index] = {
          ...state.locations[index],
          ...action.payload,
        };
      } else {
        console.log('Location not found to update.');
      }
    },

    clearLocations: state => {
      state.locations = [];
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchAddress.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        const {latitude, longitude, address, isCurrentLocation, name, id} =
          action.payload;

        if (isCurrentLocation) {
          // Update the current location's address
          state.currentLocation = {latitude, longitude, address};
        } else {
          // Add or update the address for a selected map location
          const location = state.locations.find(
            loc => loc.latitude === latitude && loc.longitude === longitude,
          );
          if (location) {
            location.address = address;
          } else {
            state.locations.push({id, latitude, longitude, address, name});
          }
        }

        state.status = 'idle';
      })
      .addCase(fetchAddress.rejected, state => {
        state.status = 'failed';
      });
  },
});

export const {addLocation, deleteLocation, updateLocation, clearLocations} =
  locationsSlice.actions;
export const selectLocations = (state: RootState) => state.locations.locations;
export const selectCurrentLocation = (state: RootState) =>
  state.locations.currentLocation;
export const selectLocationStatus = (state: RootState) =>
  state.locations.status;
export default locationsSlice.reducer;
