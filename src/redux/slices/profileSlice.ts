import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfileData } from "@/components/user/dashboard/profile-settings/types/types";
import { clearCredentials } from "./authSlice";

interface UserProfileState {
  profile: UserProfileData | null;
}

const initialState: UserProfileState = {
  profile: null,
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setUserProfile(state, action: PayloadAction<UserProfileData>) {
      state.profile = action.payload;
    },
    // update only some fields (e.g. just the profile image)
    patchUserProfile(state, action: PayloadAction<Partial<UserProfileData>>) {
      if (state.profile) Object.assign(state.profile, action.payload);
    },
  },
  // logout (clearCredentials) also empties the profile
  extraReducers: (builder) => {
    builder.addCase(clearCredentials, () => initialState);
  },
});

export const { setUserProfile, patchUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;