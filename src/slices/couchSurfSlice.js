import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  isHost: false,
  incomingRequests: {},
  outgoingRequests: {},
  requestsCount: 0,
}

export const couchSurfSlice = createSlice({
  name: 'couchSurf',
  initialState,
  reducers: {
    setIsHost: (state, action) => {
      state.isHost = action.payload;
    },
    addIncomingRequest: (state, action) => {
      const {id, data, } = action.payload;
      state.incomingRequests[id] = data;
    },
    removeIncomingRequest: (state, action) => {
      const {id, } = action.payload;
      const temp = {...state.incomingRequests, };
      delete temp[id];
      state.incomingRequests = temp;
    },
    addOutgoingRequest: (state, action) => {
      const {id, data, } = action.payload;
      state.outgoingRequests[id] = data;
    },
    removeOutgoingRequest: (state, action) => {
      const {id, } = action.payload;
      const temp = {...state.outgoingRequests, };
      delete temp[id];
      state.outgoingRequests = temp;
    },
    setRequestsCount: (state, action) => {
      state.requestsCount = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const {setIsHost, addIncomingRequest, removeIncomingRequest, addOutgoingRequest, removeOutgoingRequest, setRequestsCount, } = couchSurfSlice.actions

export default couchSurfSlice.reducer;