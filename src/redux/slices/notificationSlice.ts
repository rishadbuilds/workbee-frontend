import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification } from "@/services/notification-service";
import type { RootState } from "../store";
import { clearCredentials } from "./authSlice";

interface NotificationState {
  items: Notification[];
}

const initialState: NotificationState = {
  items: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      const exists = state.items.some((n) => n.id === action.payload.id);
      if (!exists) state.items.unshift(action.payload);
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.isRead = true;
    },
    markAllNotificationsRead(state) {
      state.items.forEach((n) => {
        n.isRead = true;
      });
    },
  },
  // logout (clearCredentials) also empties notifications
  extraReducers: (builder) => {
    builder.addCase(clearCredentials, () => initialState);
  },
});

export const selectUnreadCount = (state: RootState) =>
  state.notification.items.filter((n) => !n.isRead).length;

export const {
  setNotifications,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
} = notificationSlice.actions;
export default notificationSlice.reducer;