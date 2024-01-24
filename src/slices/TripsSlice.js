import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  trips: {},
  travellers: {},
}

export const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setTrips: (state, action) => {
      state.trips = action.payload;
    },
    addTrip: (state, action) => {
      const {id, data, } = action.payload;
      delete data["updatedAt"];
      delete data["creationTime"];
      data["tripEndedDate"] = Date(data["tripEndedDate"]);
      state.trips = {
        ...state.trips,
        [id]: {...data, id, },
      };
    },
    removeTrip: (state, action) => {
      const {id, } = action.payload;
      const temp = {...state.trips};
      delete temp[id];
      state.trips = {
        ...temp,
      };
    },
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
      if (state.travellers[id] && state.travellers[id].length > 0) {
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
  },
})

// Action creators are generated for each case reducer function
export const {setTrips, addTrip, addTraveller, removeTraveller, clearTravellers, removeTrip, } = tripsSlice.actions

export default tripsSlice.reducer