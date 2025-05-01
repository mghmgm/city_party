import { AnyAction, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import { EventAPI } from "./EventAPI";
import authReducer  from "./AuthSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AuthAPI } from "./AuthAPI";

export const store = configureStore({
  reducer: {
    [EventAPI.reducerPath]: EventAPI.reducer,
    [AuthAPI.reducerPath]: AuthAPI.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(EventAPI.middleware)
});

export type RootState = ReturnType<typeof store.getState>
export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch

export type AppThunkDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
export const useAppDispatch: () => AppThunkDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;