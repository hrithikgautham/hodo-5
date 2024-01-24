import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  notes: {},
}

export const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action) => {
      const {id, data, } = action.payload;
      state.notes[id] = data;
    },
    removeNote: (state, action) => {
      const {id, } = action.payload;
      const temp = {...state.notes, };
      delete temp[id];
      state.notes = temp;
    }
  },
})

// Action creators are generated for each case reducer function
export const {addNote, removeNote, } = notesSlice.actions

export default notesSlice.reducer;