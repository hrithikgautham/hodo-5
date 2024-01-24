import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  posts: {},
  media: {},
  likes: {},
  statuses: {},
  comments: {},
}

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action) => {
      const {id, data, } = action.payload;
      state.posts = {
        ...state.posts,
        [id]: data,
      };
    },
    removePost: (state, action) => {
      const {id, } = action.payload;
      const temp = {...state.posts, };
      delete temp[id];
      state.posts = {...temp, };
    },
    clearPosts: (state) => {
      state.posts = {};
    },
    addOrUpdateStatus: (state, action) => {
      state.statuses = {
        ...state.statuses,
        [action.payload.id]: action.payload.data,
      };
    },
    removeStatus: (state, action) => {
      const temp = {...state.statuses, };
      delete temp[action.payload.id];
      state.statuses = {
        ...temp,
      };
    },
    addMedia: (state, action) => {
      state.media = {
        ...state.media,
        [action.payload.id]: action.payload.data,
      };
    },
    updateLikes: (state, action) => {
      state.likes = {
        ...state.likes,
        [action.payload.id]: action.payload.data,
      };
    },
    updateComment: (state, action) => {
      const {pid, id, data} = action.payload;
      const comments = state.comments[pid];
      if (comments) {
        state.comments = {
          ...state.comments,
          [pid]: {
            ...comments,
            [id]: data,
          }
        }
      }
      else {
        state.comments = {
          ...state.comments,
          [pid]: {[id]: data, },
        };
      }
    },
    removeComment: (state, action) => {
      const {pid, id, } = action.payload;
      const comments = state.comments[pid];
      delete comments[id];
      state.comments = {
        ...state.comments,
        [pid]: {
          ...comments,
        }
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const {addMedia, updateLikes, addOrUpdateStatus, removeStatus, addPost, clearPosts, updateComment, removeComment, removePost, } = postsSlice.actions

export default postsSlice.reducer