import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")) || false,
};

export const authSlice = createSlice({
  name: "Authentication",
  initialState: initialState,
  reducers: {
    authenticate(state, action) {
      state.isAuthenticated = true;
      localStorage.setItem(
        "isAuthenticated",
        JSON.stringify(state.isAuthenticated),
      );
    },

    logout(state, action) {
      state.isAuthenticated = false;
      localStorage.setItem(
        "isAuthenticated",
        JSON.stringify(state.isAuthenticated),
      );
    },
  },
});

export const authActions = authSlice.actions;
const authReducer = authSlice.reducer;

export default authReducer;
