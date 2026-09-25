import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter.slice";
import userReducer from "./user.slice";
export const store = configureStore({
  reducer: {
    counterReducer,
    userReducer,
  },
});
