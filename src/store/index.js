// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import global from "./reducers/global";

const store = configureStore({
  reducer: {
    global: global,
    // add other reducers here
  },
});

export default store;
