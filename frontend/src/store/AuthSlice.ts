import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUserProfile } from '../types/types';

interface AuthState {
  userProfile: IUserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const loadInitialState = (): AuthState => {
  const token = localStorage.getItem('accessToken');
  const userProfile = localStorage.getItem('userProfile');
  
  return {
    userProfile: userProfile ? JSON.parse(userProfile) : null,
    loading: false,
    error: null,
    isAuthenticated: !!token, // Простая проверка наличия токена
  };
};

const initialState: AuthState = loadInitialState();

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegistrationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register/`,
        userData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Network error' });
    }
  }
);

export const getToken = createAsyncThunk(
  'auth/token',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/token/`,
        credentials
      );
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      return response.data.access;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Network error' });
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'auth/userProfile',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return rejectWithValue('No token found');
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      localStorage.setItem('userProfile', JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      // Если ошибка 401 - очищаем невалидный токен
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userProfile');
      }
      return rejectWithValue(error.response?.data || { message: 'Network error' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userProfile = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('userProfile', JSON.stringify(action.payload));
      })
      .addCase(getToken.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.isAuthenticated = true;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;