import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  expenses: {},
}

export const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      const {id, data, } = action.payload;
      state.expenses[id] = data;
    },
    removeExpense: (state, action) => {
      const {id, } = action.payload;
      const temp = {...state.expenses, };
      delete temp[id];
      state.expenses = temp;
    }
  },
})

// Action creators are generated for each case reducer function
export const {addExpense, removeExpense, } = expensesSlice.actions

export default expensesSlice.reducer;