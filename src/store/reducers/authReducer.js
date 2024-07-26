import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isAuth: false,
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    signin: (state, action) => {
      state.isAuth = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    signout: (state) => {
      state.isAuth = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    updateRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
