import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  compares: {},
  travellers: {},
}

export const compareSlice = createSlice({
  name: 'compares',
  initialState,
  reducers: {
    addTraveller: (state, action) => {
      const {id, data, } = action.payload;
      if (state.travellers[id] && state.travellers[id].length > 0)
        state.travellers = {
          ...state.travellers,
          [id]: [...state.travellers[id], data,],
        }
      else
        state.travellers = {
          ...state.travellers,
          [id]: [data,],
        }
    },
    removeTraveller: (state, action) => {
      const {id, data, } = action.payload;
      if (state.travellers[id].length > 0) {
        state.travellers = {
          ...state.travellers,
          [id]: state.travellers[id].filter(item => item != data),
        }
      }
    },
    clearTravellers: (state, action) => {
      const {id, } = action.payload;
      state.travellers[id] = [];
    },
    addCompare: (state, action) => {
      const {id, data, } = action.payload;
      state.compares = {
        ...state.compares,
        [id]: data,
      };
    },
    removeCompare: (state, action) => {
      const {id, } = action.payload;
      const temp = {...state.compares, };
      delete temp[id];
      state.compares = {
        ...temp,
      };
    },
  },
})

// Action creators are generated for each case reducer function
export const {setTravellers, addTraveller, removeTraveller, addCompare, removeCompare, clearTravellers, } = compareSlice.actions

export default compareSlice.reducer