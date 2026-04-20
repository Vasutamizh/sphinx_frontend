import { createSlice } from "@reduxjs/toolkit";

export const questionConfig = {
  QUESTION_TYPES: {
    SINGLE: "SINGLE_CHOICE",
    MULTIPLE: "MULTIPLE_CHOICE",
    FILL_UP: "FILL_UP",
    TRUE_FALSE: "TRUE_FALSE",
    DETAILED: "DETAILED_ANSWER",
  },
  DEFAULT_OPTIONS_COUNT: 4,
};
const QuestionTypeSlice = createSlice({
  name: "QuestionType",
  initialState: questionConfig,
  reducers: {},
});

const questionReducer = QuestionTypeSlice.reducer;
export default questionReducer;
