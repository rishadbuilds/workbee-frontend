import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "workbee-common";
import { AuthHelper } from "@/utils/auth-helper";

interface AuthState {
  user: IUser | null;
  isLoggedIn: boolean;
}

// Start from whatever is already in localStorage so a page refresh keeps logged in
const initialState: AuthState = {
  user: AuthHelper.getUser(),
  isLoggedIn: AuthHelper.isLoggedIn(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    clearCredentials(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;