import { AnyAction, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import { EventAPI } from "./EventAPI";
import authReducer  from "./AuthSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { BannerAPI } from "./BannerAPI";
import { PlaceAPI } from "./PlaceAPI";

export const store = configureStore({
  reducer: {
    [EventAPI.reducerPath]: EventAPI.reducer,
    [BannerAPI.reducerPath]: BannerAPI.reducer,
    [PlaceAPI.reducerPath]: PlaceAPI.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(EventAPI.middleware, BannerAPI.middleware, PlaceAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>
export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch

export type AppThunkDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
export const useAppDispatch: () => AppThunkDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;