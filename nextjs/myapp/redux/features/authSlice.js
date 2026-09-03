import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },

    logout(state) {
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;