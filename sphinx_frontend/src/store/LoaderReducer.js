import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "LoaderSlice",
  initialState: { isLoading: false },
  reducers: {
    loaderOn(state, action) {
      state.isLoading = true;
    },
    loaderOff(state, action) {
      state.isLoading = false;
    },
  },
});

export const loaderActions = loaderSlice.actions;
const loaderReducer = loaderSlice.reducer;

export default loaderReducer;
