import { configureStore } from "@reduxjs/toolkit";
import assessmentReducer from "./AssessmentReducer";
import authReducer from "./AuthReducer";
import loaderReducer from "./LoaderReducer";
import questionReducer from "./QuestionReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer,
    question: questionReducer,
    assessment: assessmentReducer,
  },
});

export default store;
