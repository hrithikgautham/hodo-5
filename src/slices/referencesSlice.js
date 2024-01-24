import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  references: {},
}

export const referencesSlice = createSlice({
  name: 'references',
  initialState,
  reducers: {
    addReference: (state, action) => {
      const {id, data, } = action.payload;
      state.references[id] = data;
    },
    removeReference: (state, action) => {
      const {id, } = action.payload;
      const temp = {...state.references, };
      delete temp[id];
      state.references = temp;
    }
  },
})

// Action creators are generated for each case reducer function
export const {addReference, removeReference, } = referencesSlice.actions

export default referencesSlice.reducer;