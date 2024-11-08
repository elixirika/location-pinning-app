import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationsState {
  locations: Location[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: LocationsState = {
  locations: [],
  status: 'idle',
};

// async thunk for reverse geocoding
export const fetchAddress = createAsyncThunk(
  'locations/fetchAddress',
  async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=GOOGLE_MAPS_API_KEY`
    );
    const data = await response.json();
    return {
      latitude,
      longitude,
      address: data.results[0]?.formatted_address || 'Unknown location',
    };
  }
);

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<Location>) => {
      state.locations.push(action.payload);
    },
    deleteLocation: (state, action: PayloadAction<string>) => {
      state.locations = state.locations.filter(location => location.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        const { latitude, longitude, address } = action.payload;
        const location = state.locations.find(
          loc => loc.latitude === latitude && loc.longitude === longitude
        );
        if (location) {
          location.address = address;
        }
        state.status = 'idle';
      })
      .addCase(fetchAddress.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { addLocation, deleteLocation } = locationsSlice.actions;
export const selectLocations = (state: RootState) => state.locations.locations;
export default locationsSlice.reducer;
