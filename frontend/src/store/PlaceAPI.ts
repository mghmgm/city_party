import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IPlace } from '../types/types';

export const PlaceAPI = createApi({
  reducerPath: 'placeAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
  }),
  tagTypes: ['Place'],
  endpoints: (build) => ({

    // подгрузить все места
    fetchPlaces: build.query<IPlace[], number>({
      query: (limit) => ({
        url:'/places',
        params: {
          limit: limit,
        }
      }),
      providesTags: ['Place'],
    }),
  })
})