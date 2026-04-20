import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthReducer";
import loaderReducer from "./LoaderReducer";
import questionReducer from "./QuestionReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer,
    question: questionReducer,
  },
});

export default store;
