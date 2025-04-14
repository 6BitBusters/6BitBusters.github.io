
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '...'; //percorso RootState
import { FilterOptionState } from 'types/FilterOption';


const initialState: FilterOptionState = {
  isGrater: false,
};

export const filterOptionSlice = createSlice({
  name: 'filterOption',
  initialState,
  reducers: {
    toggleIsGrater: (state) => {
      state.isGrater = !state.isGrater;
    },
  },
});

export const selectIsGrater = (state: RootState) => state.filterOption.isGrater;

export const { toggleIsGrater } = filterOptionSlice.actions;
export default filterOptionSlice.reducer;
