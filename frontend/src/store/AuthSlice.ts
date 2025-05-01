import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUserProfile } from '../types/types';

interface AuthState {
  userProfile: IUserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  userProfile: null,
  loading: false,
  error: null,
};

export const getToken = createAsyncThunk(
  'auth/token',
  async (credentials: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/token/`, credentials);
      const access_token = response.data.access;
      localStorage.setItem('accessToken', access_token);
      return access_token;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getUser = createAsyncThunk(
  'auth/user',
  async (_, thunkAPI) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return thunkAPI.rejectWithValue('No access token found');
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const AuthSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.userProfile = null;
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getToken.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getToken.fulfilled, (state: AuthState) => {
        state.loading = false;
      })
      .addCase(getToken.rejected, (state: AuthState, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUser.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state: AuthState, action: PayloadAction<IUserProfile>) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(getUser.rejected, (state: AuthState, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = AuthSlice.actions;
export default AuthSlice.reducer;
