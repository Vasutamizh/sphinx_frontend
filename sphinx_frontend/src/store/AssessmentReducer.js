import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assessment: null,
  topics: null,
};

export const assessmentSlice = createSlice({
  name: "Assessment",
  initialState: initialState,
  reducers: {
    setAssessment(state, action) {
      state.assessment = action.payload?.assessment;
    },

    setTopics(state, action) {
      state.topics = action.payload?.topics;
    },
  },
});

export const assessmentActions = assessmentSlice.actions; // for component use
const assessmentReducer = assessmentSlice.reducer; // for store use

export default assessmentReducer;
