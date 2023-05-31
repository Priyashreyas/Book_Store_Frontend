import cartReducer from "./cartReducer";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  
});

//export let persistor = persistStore(store);