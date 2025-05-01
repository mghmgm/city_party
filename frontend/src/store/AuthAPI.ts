import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getAccessToken = () => localStorage.getItem('accessToken');

export const AuthAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // получить данные о профиле
    getUserProfile: builder.query({
      query: () => '/user/profile/',
    }),

    // логин
    login: builder.mutation({
      query: (credentials) => ({
        url: '/token/',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useGetUserProfileQuery, useLoginMutation } = AuthAPI;
