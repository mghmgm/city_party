import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  loading: false,
  error: null,
};

export const getToken = createAsyncThunk(
  'auth/token',
  async (credentials: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/token/`, credentials);

      const { access_token, refresh_token } = response.data;
      localStorage.setItem('accessToken', access_token);

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const AuthSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      localStorage.removeItem('accessToken')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getToken.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getToken.fulfilled, (state: AuthState, action: PayloadAction<any>) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(getToken.rejected, (state: AuthState, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { logout } = AuthSlice.actions;
export default AuthSlice.reducer;
