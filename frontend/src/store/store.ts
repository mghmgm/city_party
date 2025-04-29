import { configureStore } from "@reduxjs/toolkit";
import { EventAPI } from "./EventAPI";

export const store = configureStore({
  reducer: {
    [EventAPI.reducerPath]: EventAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(EventAPI.middleware)
});

export type RootState = ReturnType<typeof store.getState>
export type AppStore = typeof store
export type AppDispatch = ReturnType<typeof store.dispatch>
