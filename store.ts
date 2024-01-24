import { configureStore } from '@reduxjs/toolkit'
import tripsReducer from "./src/slices/TripsSlice";
import postsReducer from "./src/slices/PostsSlice";
import chatsReducer from "./src/slices/chatsSlice";
import compareReducer from "./src/slices/compareSlice";
import themeReducer from "./src/slices/themeSlice";
import couchSurfReducer from "./src/slices/couchSurfSlice";
import notesReducer from "./src/slices/notesSlice";
import expensesReducer from "./src/slices/expensesSlice";
import userReducer from "./src/slices/userSlice";
import referencesReducer from "./src/slices/referencesSlice";

export const store = configureStore({
  reducer: {
    trips: tripsReducer,
    posts: postsReducer,
    chats: chatsReducer,
    compares: compareReducer,
    theme: themeReducer,
    couchSurf: couchSurfReducer,
    notes: notesReducer,
    expenses: expensesReducer,
    user: userReducer,
    references: referencesReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch