import { createSlice } from "@reduxjs/toolkit";
//import { Provider } from "react-redux";

const initialState = {
  Book: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
        console.log('state'+JSON.stringify(state));
        console.log('action'+JSON.stringify(action));
      const item = state.Book.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.Book.push(action.payload);
      }
    },
    removeItem: (state,action) => {
      state.Book=state.Book.filter(item=>item.id !== action.payload)
    },
    resetCart: (state) => {
      state.Book = []
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart,removeItem,resetCart } = cartSlice.actions;

export default cartSlice.reducer;