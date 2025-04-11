import { createSlice } from '@reduxjs/toolkit'

export interface FilterOptionState {
  isGrater: boolean
}

const initialState: FilterOptionState = {
  isGrater: false,
}

export const filterOptionSlice = createSlice({
  name: 'filterOption',
  initialState,
  reducers: {
    toggleIsGrater: (state) => {
      state.isGrater = !state.isGrater
    },
    // Se vuoi aggiungere più reducer, puoi farlo qui
  },
})

export const { toggleIsGrater } = filterOptionSlice.actions
export default filterOptionSlice.reducer
