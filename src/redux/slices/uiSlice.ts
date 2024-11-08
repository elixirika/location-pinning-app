import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface UIState {
  isBottomSheetExpanded: boolean;
}

const initialState: UIState = {
  isBottomSheetExpanded: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleBottomSheet: (state, action: PayloadAction<boolean>) => {
      state.isBottomSheetExpanded = action.payload;
    },
  },
});

export const { toggleBottomSheet } = uiSlice.actions;
export const selectIsBottomSheetExpanded = (state: RootState) => state.ui.isBottomSheetExpanded;
export default uiSlice.reducer;
