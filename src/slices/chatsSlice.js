import {createSlice} from '@reduxjs/toolkit';
import {Timestamp} from 'firebase/firestore';

const initialState = {
  chats: {},
  messages: {},
  notifCount: {},
};

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addChat: (state, action) => {
      const {id, data, } = action.payload;
      state.chats[id] = data;
    },
    removeChat: (state, action) => {
      const temp = {...state.chats, }
      delete temp[action.payload.id];
      state.chats = temp;
    },
    addMessage: (state, action) => {
      const {id, mId, data, } = action.payload;

      if (state.messages[id]) {
        state.messages = {
          ...state.messages,
          [id]: {
            ...state.messages[id],
            [mId]: data,
          },
        }
      }
      else {
        state.messages = {
          ...state.messages,
          [id]: {
            [mId]: data,
          },
        }
      }
    },
    removeMessage: (state, action) => {
      const {id, mId, } = action.payload;
      const temp = {...state.messages[id], }
      delete temp[mId];
      if (state.messages[id]) {
        state.messages = {
          ...state.messages,
          [id]: {...temp, },
        }
      }
    },
    clearMessages: (state, action) => {
      const {id, } = action.payload;
      const temp = {...state.messages};
      delete temp[id];
      state.messages = {
        ...temp,
      }
    },
    incNotif: (state, action) => {
      const {id, } = action.payload;
      if (state.notifCount[id])
        state.notifCount = {
          ...state.notifCount,
          [id]: state.notifCount[id] + 1,
        }
      else
        state.notifCount = {
          ...state.notifCount,
          [id]: 1,
        }
    },
    decNotif: (state, action) => {
      const {id, } = action.payload;
      if (state.notifCount[id])
        state.notifCount = {
          ...state.notifCount,
          [id]: state.notifCount[id] - 1,
        }
    },
  },
});

// Action creators are generated for each case reducer function
export const {addChat, removeChat, addMessage, removeMessage, clearMessages, incNotif, decNotif, } = chatsSlice.actions;

export default chatsSlice.reducer;