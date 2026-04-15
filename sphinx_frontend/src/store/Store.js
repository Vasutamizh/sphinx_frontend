import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthReducer";
import loaderReducer from "./LoaderReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer,
  },
});

export default store;
