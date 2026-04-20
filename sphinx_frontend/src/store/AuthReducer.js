import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  partyId: "",
  userRole: {},
};

export const authSlice = createSlice({
  name: "Authentication",
  initialState: initialState,
  reducers: {
    authenticate(state, action) {
      state.isAuthenticated = true;
      // localStorage.setItem(
      //   "isAuthenticated",
      //   JSON.stringify(state.isAuthenticated),
      // );
      state.userRole = action.payload.userRole;
      state.partyId = action.payload.partyId;
      // localStorage.setItem("partyId", JSON.stringify(action.payload.partyId));
    },

    logout(state, action) {
      state.isAuthenticated = false;
      state.userRole = {};
      // localStorage.setItem(
      //   "isAuthenticated",
      //   JSON.stringify(state.isAuthenticated),
      // );
    },
  },
});

export const authActions = authSlice.actions; // for component use
const authReducer = authSlice.reducer; // for store use

export default authReducer;
