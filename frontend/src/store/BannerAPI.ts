import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IBanner } from '../types/types';

export const BannerAPI = createApi({
  reducerPath: 'bannerAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
  }),
  tagTypes: ['Banner'],
  endpoints: (build) => ({

    // подгрузить рандомный баннер
    fetchRandomBanner: build.query<IBanner, void>({
      query: () => '/banners/random',
      providesTags: ['Banner'],
    }),
  })
})